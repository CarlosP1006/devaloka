import { Depth } from '@utils/Depth';

export class PlayerObject extends Phaser.Physics.Arcade.Sprite {
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
    (player.body as Phaser.Physics.Arcade.Body).setSize(24, 40);
    player.setOffset(20, 20);
    return player;
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
    this.setVelocityY(-750);
    this.anims.play('jump', true);
  }

  public idle(): void {
    this.setVelocityX(0);
    this.anims.play('idle', true);
  }

  public attack(): void {
    this.setVelocityX(0);
    this.setTexture('player-sword-big');
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.down) {
      body.enable = false;
    } else {
      const vy = body.velocity.y;
      this.setOffset(71, 71);
      body.reset(this.x, this.y);
      body.velocity.y = vy;
    }
    this.anims.play('attack', true);
  }

  public endAttack(): void {
    this.setTexture('player');
    this.setOffset(20, 20);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.enable) {
      const vy = body.velocity.y;
      body.reset(this.x, this.y);
      body.velocity.y = vy;
    } else {
      body.reset(this.x, this.y);
      body.enable = true;
    }
    this.anims.play(body.blocked.down ? 'idle' : 'jump', true);
  }
}
