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

    const { group: chunk7 } = createGroundChunk(
      this,
      7,
      4,
      [0, 1, 2],
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk9 } = createGroundChunk(
      this,
      9,
      7,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk14 } = createGroundChunk(
      this,
      14,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk15 } = createGroundChunk(
      this,
      15,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk16 } = createGroundChunk(
      this,
      16,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk17 } = createGroundChunk(
      this,
      17,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk18 } = createGroundChunk(
      this,
      18,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    this.add
      .image(2050, 405, 'swamp-tree-large')
      .setOrigin(0.5, 1)
      .setScale(0.75)
      .setDepth(Depth.BACKGROUND_2);

    this.add
      .image(450, 615, 'swamp-tree-twisted')
      .setOrigin(0.5, 1)
      .setScale(0.65)
      .setDepth(Depth.BACKGROUND_1);

    this.add
      .image(120, 712, 'swamp-stone-rune')
      .setOrigin(0.5, 1)
      .setScale(1.1)
      .setDepth(Depth.MAIN);

    const stoneRuneGroup = this.physics.add.staticGroup();
    const stoneBody = this.add.rectangle(120, 712, 235, 450, 0, 0);
    stoneBody.setOrigin(0.5, 1);
    stoneRuneGroup.add(stoneBody);

    const player = PlayerObject.create(this, 300, groundTop - 60);
    this.physics.add.collider(player, [
      groundGroup,
      stoneRuneGroup,
      chunk9,
      chunk14,
      chunk15,
      chunk16,
      chunk17,
      chunk18,
      chunk7,
    ]);
    PlayerCamera.setup(this, player, mapWidth);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this);
  }

  update(): void {
    this.playerService.update();
  }
}
