export class PlayerObject extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
  }

  static create(scene: Phaser.Scene, x: number, y: number): PlayerObject {
    const player = new PlayerObject(scene, x, y);
    scene.add.existing(player);
    scene.physics.add.existing(player);
    player.setCollideWorldBounds(true);
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
    this.setVelocityY(-600);
    this.anims.play('jump', true);
  }

  public idle(): void {
    this.setVelocityX(0);
    this.anims.play('idle', true);
  }
}
