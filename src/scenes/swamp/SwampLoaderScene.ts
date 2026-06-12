import swampGroundRoots from '@assets/swamp/images/swamp-ground-roots.png';
import swampBackground from '@assets/swamp/images/spawn-swamp-background.png';
import swampGroundDirt from '@assets/swamp/images/swamp-ground-dirt.png';
import swampTreeTwisted from '@assets/swamp/images/swamp-tree-twisted.png';
import swampTreeLarge from '@assets/swamp/images/swamp-tree-large.png';
import swampStoneRune from '@assets/swamp/images/swamp-stone-rune.png';
import swampOwl from '@assets/swamp/images/swamp-owl.png';
import swampStep from '@assets/swamp/audio/swamp-step.ogg';
import swampAmbient from '@assets/swamp/audio/swamp-ambient.ogg';
import swampOwlCall from '@assets/swamp/audio/swamp-owl-call.ogg';
import { container } from '@containers/index';
import { SaveManagerService } from '@services/SaveManagerService';

const SWAMP_ROOMS = new Set(['SpawnSwampRoom', 'ForestSwampRoom']);

export class SwampLoaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SwampLoaderScene' });
  }

  preload(): void {
    this.load.image('swamp-ground', swampGroundRoots);
    this.load.image('spawn-swamp-background', swampBackground);
    this.load.image('swamp-ground-dirt', swampGroundDirt);
    this.load.image('swamp-tree-twisted', swampTreeTwisted);
    this.load.image('swamp-tree-large', swampTreeLarge);
    this.load.image('swamp-stone-rune', swampStoneRune);
    this.load.spritesheet('swamp-owl', swampOwl, {
      frameWidth: 338,
      frameHeight: 369,
    });
    this.load.audio('swamp-step', swampStep);
    this.load.audio('swamp-ambient', swampAmbient);
    this.load.audio('swamp-owl-call', swampOwlCall);
  }

  create(data: { targetRoom?: string; spawnX?: number; spawnY?: number }): void {
    const saveManagerService =
      container.resolve<SaveManagerService>('saveManagerService');
    if (data?.targetRoom && SWAMP_ROOMS.has(data.targetRoom)) {
      saveManagerService.save({
        location: { room: data.targetRoom, x: data.spawnX ?? 0, y: data.spawnY ?? 0 },
      });
      this.scene.start(data.targetRoom, { spawnX: data.spawnX, spawnY: data.spawnY });
      return;
    }
    const room = saveManagerService.get()?.location?.room;
    this.scene.start(room && SWAMP_ROOMS.has(room) ? room : 'SpawnSwampRoom', {});
  }
}
