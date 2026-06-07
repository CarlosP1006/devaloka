import { container } from '../../../containers';
import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { PlayerCamera } from '@objects/player/utils/PlayerCamera';
import { PlayerService } from '@objects/player/services/PlayerService';
import { createGround } from '@utils/createGround';
import { createGroundChunk, TILE_H } from '@utils/createGroundChunk';
import { Depth } from '@utils/Depth';

export class SpawnSwampRoom extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'SpawnSwampRoom' });
  }

  preload(): void {}

  create(): void {
    const mapWidth = 2560;
    const { group: groundGroup } = createGround(
      this,
      'swamp-ground',
      undefined,
    );

    const groundTop = this.scale.height - TILE_H;
    this.add
      .image(mapWidth / 2, 280, 'swamp-background')
      .setDisplaySize(mapWidth, this.scale.height)
      .setDepth(Depth.FAR_BACKGROUND)
      .setAlpha(0.6);

    const { group: chunk1 } = createGroundChunk(
      this,
      4,
      10,
      [0, 1, 2, 3],
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const player = PlayerObject.create(this, 100, groundTop - 60);
    this.physics.add.collider(player, [groundGroup, chunk1]);
    PlayerCamera.setup(this, player, mapWidth);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this);
  }

  update(): void {
    this.playerService.update();
  }
}
