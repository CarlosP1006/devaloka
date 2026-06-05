import playerImg from '@assets/player.png';
import { LPC } from '@objects/player/PlayerAnimations';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.spritesheet('player', playerImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create(): void {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', LPC.idle.right),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', LPC.walk.right),
      frameRate: 9,
      repeat: -1,
    });

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', LPC.run.right),
      frameRate: 12,
      repeat: -1,
    });

    this.scene.start('GameScene');
  }
}
