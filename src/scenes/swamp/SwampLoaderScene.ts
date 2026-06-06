import playerImg from '@assets/player/images/player.png';
import swampGroundRoots from '@assets/swamp/images/swamp-ground-roots.png';
import swampTrunkBroken from '@assets/swamp/images/swamp-trunk-broken.png';
import swampTrunkFace from '@assets/swamp/images/swamp-trunk-face.png';
import swampTreesCluster from '@assets/swamp/images/swamp-trees-cluster.png';
import swampBackground from '@assets/swamp/images/swamp-background.png';
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
    this.load.image('swamp-trunk-broken', swampTrunkBroken);
    this.load.image('swamp-trunk-face', swampTrunkFace);
    this.load.image('swamp-trees-cluster', swampTreesCluster);
    this.load.image('swamp-background', swampBackground);
  }

  create(): void {
    loadPlayerAnimations(this);
    this.scene.start('SpawnSwampRoom');
  }
}
