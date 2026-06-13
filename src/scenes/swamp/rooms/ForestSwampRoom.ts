import { container } from '@containers/index';
import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { PlayerCamera } from '@objects/player/utils/PlayerCamera';
import { PlayerService } from '@objects/player/services/PlayerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { createGround } from '@utils/createGround';
import { createTransitionLine } from '@utils/createTransitionLine';
import { createGroundChunk, TILE_H } from '@utils/createGroundChunk';

const mapWidth = 2560;

export class ForestSwampRoom extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'ForestSwampRoom' });
  }

  create(data: { spawnX?: number; spawnY?: number }): void {
    const { group: groundGroup } = createGround(
      this,
      'swamp-ground',
      undefined,
    );
    const groundTop = this.scale.height - TILE_H;

    const saveManagerService =
      container.resolve<SaveManagerService>('saveManagerService');
    const save = saveManagerService.get();

    const savedHere = save?.location?.room === 'ForestSwampRoom';
    const spawnX = data?.spawnX ?? (savedHere ? save.location?.x ?? 300 : 300);
    const spawnY =
      data?.spawnY ??
      (savedHere ? save.location?.y ?? groundTop - 60 : groundTop - 60);

    const { group: chunk0 } = createGroundChunk(
      this,
      0,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk1 } = createGroundChunk(
      this,
      1,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk2 } = createGroundChunk(
      this,
      2,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const player = PlayerObject.create(this, spawnX, spawnY);
    this.physics.add.collider(player, [groundGroup, chunk0, chunk1, chunk2]);

    createTransitionLine(
      this,
      0,
      groundTop / 2,
      1,
      groundTop,
      player,
      'forest-swamp-room-door-1',
    );

    PlayerCamera.setup(this, player, mapWidth);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this, 'swamp');

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.removeAllListeners();
      this.input.keyboard?.removeAllListeners();
    });
  }

  update(): void {
    this.playerService.update();
  }
}
