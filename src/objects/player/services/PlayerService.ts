import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { SaveManagerService } from '@services/SaveManagerService';
import { GameInputService } from '@services/GameInputService';
// CODIGO PARA APAGAR DEPOIS
import { DEV_PRINT_SAVE } from '@utils/DEV_PRINT_SAVE';
// CODIGO PARA APAGAR DEPOIS

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
    this.gameInputService.init(scene);

    if (this.saveTimer) this.saveTimer.remove();
    this.saveTimer = scene.time.addEvent({
      delay: SAVE_INTERVAL,
      loop: true,
      callback: () => {
        if (!this.player.body!.blocked.down) return;
        const elapsed = Math.floor((Date.now() - this.sessionStart) / 1000);
        const slotInfo = this.saveManagerService.get()?.slotInfo;
        this.saveManagerService.save({
          location: {
            room: scene.scene.key,
            x: Math.round(this.player.x),
            y: Math.round(this.player.y),
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

    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown() || this.attacking) return;
      const onGround = this.player.body!.blocked.down;
      if (!onGround && this.hasAttackedInAir) return;
      this.attacking = true;
      if (!onGround) this.hasAttackedInAir = true;
      this.player.attack();
      this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.attacking = false;
        this.player.endAttack();
      });
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

  update(): void {
    if (this.attacking) {
      this.player.setVelocityX(0);
      this.player.syncSwordSprite();
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
