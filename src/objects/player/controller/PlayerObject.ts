import { Depth } from '@utils/Depth';
import { LPC_SLING } from '@objects/player/utils/PlayerSlingAnimations';

export class PlayerObject extends Phaser.Physics.Arcade.Sprite {
  private swordSprite!: Phaser.GameObjects.Sprite;
  private swordHitbox!: Phaser.GameObjects.Zone;
  private shieldSprite!: Phaser.GameObjects.Sprite;
  private shieldHitbox!: Phaser.GameObjects.Zone;
  private shieldOn = false;
  private previewing = false;
  private slinging = false;
  private slingRight = true;
  private slingAimVersion = 0;

  private static readonly HIT_W = 75;
  private static readonly HIT_H = 8;
  private static readonly HIT_OFFSET_X = 57;
  private static readonly HIT_OFFSET_Y = -3;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
  }

  static create(scene: Phaser.Scene, x: number, y: number): PlayerObject {
    const player = new PlayerObject(scene, x, y);
    scene.add.existing(player);
    scene.physics.add.existing(player);
    player.setCollideWorldBounds(true);
    player.setDepth(Depth.PLAYER);
    player.setScale(1.6);
    (player.body as Phaser.Physics.Arcade.Body).setSize(22, 38);
    player.setOffset(21, 21);
    player.swordSprite = scene.add.sprite(x, y, 'player-sword-big');
    player.swordSprite.setScale(1.6);
    player.swordSprite.setDepth(Depth.PLAYER);
    player.swordSprite.setVisible(false);
    player.shieldSprite = scene.add.sprite(x, y, 'shield-sword');
    player.shieldSprite.setDisplaySize(110, 110);
    player.shieldSprite.setDepth(Depth.PLAYER + 1);
    player.shieldSprite.setAlpha(0.23);
    player.shieldSprite.setVisible(false);
    player.shieldHitbox = scene.add.zone(-9999, -9999, 90, 90);
    scene.physics.add.existing(player.shieldHitbox);
    const shb = player.shieldHitbox.body as Phaser.Physics.Arcade.Body;
    shb.setAllowGravity(false);
    shb.setCircle(45);
    shb.enable = false;
    player.swordHitbox = scene.add.zone(
      -9999,
      -9999,
      PlayerObject.HIT_W,
      PlayerObject.HIT_H,
    );
    scene.physics.add.existing(player.swordHitbox);
    const hb = player.swordHitbox.body as Phaser.Physics.Arcade.Body;
    hb.setAllowGravity(false);
    hb.enable = false;
    return player;
  }

  public activateShield(onDone: () => void): void {
    const show = (key: string, frame?: number, alpha = 0.23) => {
      this.shieldSprite.setTexture(key, frame);
      this.shieldSprite.setDisplaySize(110, 110);
      this.shieldSprite.setAlpha(alpha);
      this.shieldSprite.setVisible(true);
    };
    show('shield-sword');
    this.shieldOn = true;
    (this.shieldHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
    this.scene.time.delayedCall(2000, () => {
      this.shieldOn = false;
      (this.shieldHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
      this.shieldHitbox.setPosition(-9999, -9999);
      (this.shieldHitbox.body as Phaser.Physics.Arcade.Body).reset(-9999, -9999);
      const breakFrames = [0, 1, 2];
      let i = 0;
      const nextBreak = () => {
        if (i >= breakFrames.length) {
          this.shieldSprite.setVisible(false);
          this.shieldSprite.setTexture('shield-sword');
          this.shieldSprite.setDisplaySize(110, 110);
          onDone();
          return;
        }
        show('shield-sword-break', breakFrames[i], 0.45);
        i++;
        this.scene.time.delayedCall(150, nextBreak);
      };
      nextBreak();
    });
  }

  get isPreviewing(): boolean {
    return this.previewing;
  }

  get isSlinging(): boolean {
    return this.slinging;
  }

  get isSlingRight(): boolean {
    return this.slingRight;
  }

  public equipSling(facingRight: boolean): void {
    if (this.slinging) return;
    this.slinging = true;
    this.slingRight = facingRight;
    this.anims.stop();
    this.setTexture('player-sling');
    this.setFlipX(false);
    this.slingAimVersion++;
    const version = this.slingAimVersion;
    const aimFrames = facingRight
      ? LPC_SLING.shoot_right.aim
      : LPC_SLING.shoot_left.aim;
    let i = 0;
    const step = () => {
      if (!this.slinging || this.slingAimVersion !== version) return;
      this.setFrame(aimFrames[i]);
      i++;
      if (i < aimFrames.length) this.scene.time.delayedCall(50, step);
    };
    step();
  }

  public changeSlingDirection(facingRight: boolean): void {
    if (!this.slinging || this.slingRight === facingRight) return;
    this.slingRight = facingRight;
    this.slingAimVersion++;
    this.setFlipX(false);
    const aimFrames = facingRight
      ? LPC_SLING.shoot_right.aim
      : LPC_SLING.shoot_left.aim;
    this.setFrame(aimFrames[aimFrames.length - 1]);
  }

  public shootSling(onDone: () => void): void {
    const releaseFrames = this.slingRight
      ? LPC_SLING.shoot_right.release
      : LPC_SLING.shoot_left.release;
    let i = 0;
    const step = () => {
      this.setFrame(releaseFrames[i]);
      i++;
      if (i < releaseFrames.length) {
        this.scene.time.delayedCall(80, step);
      } else {
        onDone();
      }
    };
    step();
  }

  public unequipSling(): void {
    this.slinging = false;
    this.slingAimVersion++;
    this.setTexture('player');
  }

  public previewSlingAnims(onDone: () => void): void {
    if (this.previewing) return;
    this.previewing = true;
    const groups = [
      { name: 'shoot_left',  frames: [13,14,15,16,17,18,19,20,21,22,23,24,25] },
      { name: 'shoot_right', frames: [39,40,41,42,43,44,45,46,47,48,49,50,51] },
    ];
    const all: { frame: number; label: string }[] = [];
    groups.forEach(g =>
      g.frames.forEach((f, i) =>
        all.push({ frame: f, label: `${g.name}  ${i + 1}/${g.frames.length}` }),
      ),
    );

    this.anims.stop();
    this.setTexture('player-sling');
    const label = this.scene.add
      .text(this.x, this.y - 80, '', {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 6, y: 4 },
      })
      .setDepth(200)
      .setOrigin(0.5);

    let i = 0;
    const next = () => {
      if (i >= all.length) {
        this.previewing = false;
        this.setTexture('player');
        label.destroy();
        onDone();
        return;
      }
      this.setFrame(all[i].frame);
      label.setText(all[i].label);
      i++;
      this.scene.time.delayedCall(1000, next);
    };
    next();
  }

  public resetShield(): void {
    this.shieldOn = false;
    this.shieldSprite.setVisible(false);
    this.shieldSprite.setTexture('shield-sword');
    this.shieldSprite.setDisplaySize(110, 110);
    const shb = this.shieldHitbox.body as Phaser.Physics.Arcade.Body;
    shb.enable = false;
    shb.reset(-9999, -9999);
    this.shieldHitbox.setPosition(-9999, -9999);
  }

  public syncShield(): void {
    this.shieldSprite.setPosition(this.x, this.y);
    if (!this.shieldOn) return;
    const shb = this.shieldHitbox.body as Phaser.Physics.Arcade.Body;
    this.shieldHitbox.setPosition(this.x, this.y);
    shb.reset(this.x, this.y);
  }

  public getShieldHitbox(): Phaser.GameObjects.Zone {
    return this.shieldHitbox;
  }

  public syncSwordSprite(): void {
    this.swordSprite.setPosition(this.x, this.y);
    const dir = this.flipX ? -1 : 1;
    const hbX = this.x + PlayerObject.HIT_OFFSET_X * dir;
    const hbY = this.y + PlayerObject.HIT_OFFSET_Y;
    this.swordHitbox.setPosition(hbX, hbY);
    (this.swordHitbox.body as Phaser.Physics.Arcade.Body).reset(hbX, hbY);
  }

  public getSwordHitbox(): Phaser.GameObjects.Zone {
    return this.swordHitbox;
  }

  public moveLeft(): void {
    this.setVelocityX(-200);
    this.setFlipX(true);
    this.anims.play('walk', true);
  }

  public moveRight(): void {
    this.setVelocityX(200);
    this.setFlipX(false);
    this.anims.play('walk', true);
  }

  public runLeft(): void {
    this.setVelocityX(-400);
    this.setFlipX(true);
    this.anims.play('run', true);
  }

  public runRight(): void {
    this.setVelocityX(400);
    this.setFlipX(false);
    this.anims.play('run', true);
  }

  public jump(): void {
    this.setVelocityY(-810);
    this.anims.play('jump', true);
  }

  public idle(): void {
    this.setVelocityX(0);
    this.anims.play('idle', true);
  }

  public attack(): void {
    this.setVelocityX(0);
    this.setVisible(false);
    this.swordSprite.setPosition(this.x, this.y);
    this.swordSprite.setFlipX(this.flipX);
    this.swordSprite.setVisible(true);
    (this.swordHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
    this.syncSwordSprite();
    this.swordSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.emit(Phaser.Animations.Events.ANIMATION_COMPLETE);
    });
    this.swordSprite.play('attack');
  }

  public endAttack(): void {
    this.swordSprite.setVisible(false);
    this.setVisible(true);
    const hb = this.swordHitbox.body as Phaser.Physics.Arcade.Body;
    hb.enable = false;
    hb.reset(-9999, -9999);
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.anims.play(body.blocked.down ? 'idle' : 'jump', true);
  }
}
