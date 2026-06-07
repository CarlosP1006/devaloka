import playerImg from '@assets/player/images/player.png';
import swampGroundRoots from '@assets/swamp/images/swamp-ground-roots.png';
import swampBackground from '@assets/swamp/images/swamp-background.png';
import swampGroundDirt from '@assets/swamp/images/swamp-ground-dirt.png';
import { loadPlayerAnimations } from '@objects/player/PlayerLoader';

export class SwampLoaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SwampLoaderScene' });
  }

  preload(): void {
    this.load.spritesheet('player', playerImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image('swamp-ground', swampGroundRoots);
    this.load.image('swamp-background', swampBackground);
    this.load.image('swamp-ground-dirt', swampGroundDirt);
  }

  create(): void {
    loadPlayerAnimations(this);
    this.scene.start('SpawnSwampRoom');
  }
}
