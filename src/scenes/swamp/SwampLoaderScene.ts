import playerImg from '@assets/player/images/player.png';
import swampGroundRoots from '@assets/swamp/images/swamp-ground-roots.png';
import swampBackground from '@assets/swamp/images/swamp-background.png';
import swampGroundDirt from '@assets/swamp/images/swamp-ground-dirt.png';
import swampTreeTwisted from '@assets/swamp/images/swamp-tree-twisted.png';
import swampTreeLarge from '@assets/swamp/images/swamp-tree-large.png';
import swampStoneRune from '@assets/swamp/images/swamp-stone-rune.png';
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
    this.load.image('swamp-tree-twisted', swampTreeTwisted);
    this.load.image('swamp-tree-large', swampTreeLarge);
    this.load.image('swamp-stone-rune', swampStoneRune);
  }

  create(): void {
    loadPlayerAnimations(this);
    this.scene.start('SpawnSwampRoom');
  }
}
