import playerImg from '@assets/player/images/player.png';
import { loadPlayerAnimations } from '@objects/player/PlayerLoader';

export class SwampLoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SwampLoadingScene' });
  }

  preload(): void {
    this.load.spritesheet('player', playerImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create(): void {
    loadPlayerAnimations(this);
    this.scene.start('SwampRoomScene');
  }
}
