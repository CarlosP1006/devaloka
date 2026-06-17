import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { SaveManagerService } from '@services/SaveManagerService';
import { GameInputService } from '@services/GameInputService';
import { getTileSize } from '@utils/createGroundChunk';
// CODIGO PARA APAGAR DEPOIS
import { DEV_PRINT_SAVE } from '@utils/DEV_PRINT_SAVE';
// CODIGO PARA APAGAR DEPOIS

const blockedCanvases = new WeakSet<HTMLCanvasElement>();

const STEP_INTERVAL = 80;
const SAVE_INTERVAL = 1500;

type MoveState =
  | ''
  | 'moveLeft'
  | 'moveRight'
  | 'runLeft'
  | 'runRight'
  | 'idle';

export class PlayerService {
  private player!: PlayerObject;
  private scene!: Phaser.Scene;
  private biome = '';
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private lastX = 0;
  private stepDistance = 0;
  private saveManagerService: SaveManagerService;
  private gameInputService: GameInputService;
  private sessionStart = 0;
  private basePlayTime = 0;
  private attacking = false;
  private hasAttackedInAir = false;
  private saveTimer: Phaser.Time.TimerEvent | null = null;
  private currentAnim: MoveState = '';
  private swingSound: Phaser.Sound.BaseSound | null = null;
  private shieldActive = false;
  private slingActive = false;
  private slingFiring = false;
  private slingGraphics: Phaser.GameObjects.Graphics | null = null;
  private slingGroup: Phaser.Physics.Arcade.Group | null = null;

  constructor(
    saveManagerService: SaveManagerService,
    gameInputService: GameInputService,
  ) {
    this.saveManagerService = saveManagerService;
    this.gameInputService = gameInputService;
  }

  init(player: PlayerObject, scene: Phaser.Scene, biome = ''): void {
    this.player = player;
    this.scene = scene;
    this.biome = biome;
    this.lastX = player.x;
    this.sessionStart = Date.now();
    this.basePlayTime = this.saveManagerService.get()?.slotInfo?.playTime ?? 0;
    this.shieldActive = false;
    this.slingActive = false;
    this.slingFiring = false;
    if (this.slingGraphics) {
      this.slingGraphics.destroy();
      this.slingGraphics = null;
    }
    this.player.resetShield();
    if (this.player.isSlinging) this.player.unequipSling();
    this.slingGroup = null;
    if (!scene.textures.exists('sling-stone')) {
      const g = scene.add.graphics();
      g.fillStyle(0xaaaaaa);
      g.fillCircle(4, 4, 4);
      g.generateTexture('sling-stone', 8, 8);
      g.destroy();
    }
    this.slingGroup = scene.physics.add.group({
      defaultKey: 'sling-stone',
      maxSize: 5,
    });
    this.gameInputService.init(scene);
    if (!blockedCanvases.has(scene.game.canvas)) {
      scene.game.canvas.addEventListener('contextmenu', e =>
        e.preventDefault(),
      );
      window.addEventListener(
        'keydown',
        e => {
          if (
            e.ctrlKey &&
            e.key !== 'Control' &&
            e.key !== 'F5' &&
            e.key !== 'F12'
          )
            e.preventDefault();
        },
        true,
      );
      blockedCanvases.add(scene.game.canvas);
    }

    if (this.swingSound) this.swingSound.destroy();
    this.swingSound = scene.sound.add('sword-swing', { volume: 8 });

    if (this.saveTimer) this.saveTimer.remove();
    this.saveTimer = scene.time.addEvent({
      delay: SAVE_INTERVAL,
      loop: true,
      callback: () => {
        if (!this.player.body!.blocked.down) return;
        const elapsed = Math.floor((Date.now() - this.sessionStart) / 1000);
        const slotInfo = this.saveManagerService.get()?.slotInfo;
        const { groundTop, tileH } = getTileSize(scene);
        const yTile = (groundTop - this.player.y) / tileH;
        this.saveManagerService.save({
          location: {
            room: scene.scene.key,
            x: Math.round(this.player.x),
            y: Math.round(this.player.y),
            yTile,
          },
          ...(slotInfo
            ? {
                slotInfo: {
                  ...slotInfo,
                  playTime: this.basePlayTime + elapsed,
                },
              }
            : {}),
        });
      },
    });
    // CODIGO PARA APAGAR DEPOIS
    scene.input.keyboard!.on('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ç' || e.key === 'Ç') DEV_PRINT_SAVE();
    });
    // CODIGO PARA APAGAR DEPOIS

    scene.input.keyboard!.on('keydown-CTRL', () => {
      if (
        this.attacking ||
        this.player.isPreviewing ||
        this.slingActive ||
        this.slingFiring
      )
        return;
      if (!this.player.body!.blocked.down) return;
      this.slingActive = true;
      this.currentAnim = '';
      this.player.setVelocityX(0);
      const pointer = scene.input.activePointer;
      const wp0 = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.player.equipSling(wp0.x > this.player.x);
      this.slingGraphics = scene.add.graphics();
      this.slingGraphics.setDepth(200);
    });

    scene.input.keyboard!.on('keyup-CTRL', () => {
      if (!this.slingActive) return;
      this.slingActive = false;
      this.currentAnim = '';
      this.player.unequipSling();
      if (this.slingGraphics) {
        this.slingGraphics.destroy();
        this.slingGraphics = null;
      }
    });

    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (
        pointer.rightButtonDown() &&
        !this.shieldActive &&
        !this.slingActive
      ) {
        this.shieldActive = true;
        this.player.activateShield(() => {
          this.shieldActive = false;
        });
        return;
      }
      if (!pointer.leftButtonDown()) return;
      if (this.slingActive) {
        const unlocked =
          this.saveManagerService.get()?.weapons?.sling?.unlocked ?? true;
        if (!unlocked) return;
        const wp = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const facingRight = this.player.isSlingRight;
        const tipX = this.player.x + (facingRight ? 22 : -22);
        const tipY = this.player.y - 14;
        const angle = Math.atan2(wp.y - tipY, wp.x - tipX);
        const speed = 1000;
        const stone = this.slingGroup?.get(tipX, tipY) as
          | Phaser.Physics.Arcade.Sprite
          | undefined;
        if (stone) {
          stone.setActive(true).setVisible(true);
          const body = stone.body as Phaser.Physics.Arcade.Body;
          body.enable = true;
          body.setAllowGravity(false);
          body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        }
        this.slingActive = false;
        this.slingFiring = true;
        this.currentAnim = '';
        this.player.setVelocityX(0);
        if (this.slingGraphics) {
          this.slingGraphics.destroy();
          this.slingGraphics = null;
        }
        this.player.shootSling(() => {
          this.slingFiring = false;
          this.player.unequipSling();
          this.currentAnim = '';
        });
        return;
      }
      if (this.attacking) return;
      if (!this.saveManagerService.get()?.weapons?.sword?.unlocked) return;
      const onGround = this.player.body!.blocked.down;
      if (!onGround && this.hasAttackedInAir) return;
      this.attacking = true;
      if (!onGround) this.hasAttackedInAir = true;
      this.swingSound!.play();
      this.player.attack();
      this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.swingSound?.stop();
        this.attacking = false;
        this.player.endAttack();
      });
    });

    scene.input.keyboard!.on('keydown-H', () => {
      if (this.attacking || this.shieldActive || this.player.isPreviewing)
        return;
      this.player.previewSlingAnims(() => {});
    });

    this.keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.shiftKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
    );
    this.spaceKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
  }

  getSwingSound(): Phaser.Sound.BaseSound | null {
    return this.swingSound;
  }

  registerSlingColliders(groups: Phaser.Physics.Arcade.StaticGroup[]): void {
    if (!this.slingGroup) return;
    const group = this.slingGroup;
    groups.forEach(g => {
      this.scene.physics.add.collider(group, g, stone => {
        const s = stone as Phaser.Physics.Arcade.Sprite;
        group.killAndHide(s);
        const b = s.body as Phaser.Physics.Arcade.Body;
        b.stop();
        b.enable = false;
      });
    });
  }

  getSlingGroup(): Phaser.Physics.Arcade.Group | null {
    return this.slingGroup;
  }

  update(): void {
    this.player.syncShield();
    this.slingGroup?.getChildren().forEach(c => {
      const s = c as Phaser.Physics.Arcade.Sprite;
      if (!s.active) return;
      if (s.x < -50 || s.x > 2610 || s.y < -100 || s.y > 820) {
        this.slingGroup!.killAndHide(s);
        const b = s.body as Phaser.Physics.Arcade.Body;
        b.stop();
        b.enable = false;
      }
    });
    if (this.player.isPreviewing) return;
    if (this.slingFiring) {
      this.player.setVelocityX(0);
      return;
    }
    if (this.slingActive) {
      this.player.setVelocityX(0);
      const pointer = this.scene.input.activePointer;
      const wp = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const wx = wp.x;
      const wy = wp.y;
      this.player.changeSlingDirection(wx > this.player.x);
      if (this.slingGraphics) {
        const facingRight = this.player.isSlingRight;
        const tipX = this.player.x + (facingRight ? 22 : -22);
        const tipY = this.player.y - 14;
        this.slingGraphics.clear();
        this.slingGraphics.lineStyle(1.5, 0x00ddff, 0.8);
        this.slingGraphics.beginPath();
        this.slingGraphics.moveTo(tipX, tipY);
        this.slingGraphics.lineTo(wx, wy);
        this.slingGraphics.strokePath();
      }
      return;
    }
    if (this.attacking) {
      this.player.setVelocityX(0);
      if (!this.player.body!.blocked.down) this.player.syncSwordSprite();
      this.currentAnim = '';
      return;
    }

    const running = this.shiftKey.isDown;
    const onGround = this.player.body!.blocked.down;

    if (onGround && this.hasAttackedInAir) this.hasAttackedInAir = false;

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && onGround) {
      this.player.jump();
      this.scene.sound.play('player-jump', { volume: 0.35 });
      this.currentAnim = '';
    }

    let state: MoveState = '';
    if (this.keyA.isDown) state = running ? 'runLeft' : 'moveLeft';
    else if (this.keyD.isDown) state = running ? 'runRight' : 'moveRight';
    else if (onGround) state = 'idle';

    if (state && state !== this.currentAnim) {
      this.currentAnim = state;
      this.player[state]();
    }

    const currentX = this.player.x;
    const moved = Math.abs(currentX - this.lastX);
    this.lastX = currentX;

    if (this.biome && onGround && (this.keyA.isDown || this.keyD.isDown)) {
      this.stepDistance += moved;
      if (this.stepDistance >= STEP_INTERVAL) {
        this.stepDistance = 0;
        this.scene.sound.play(`${this.biome}-step`, {
          volume: 0.9,
        });
      }
    } else {
      this.stepDistance = 0;
    }
  }
}
