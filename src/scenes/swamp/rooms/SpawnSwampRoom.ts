import { container } from '../../../containers';
import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { PlayerCamera } from '@objects/player/utils/PlayerCamera';
import { PlayerService } from '@objects/player/services/PlayerService';
import { createGround } from '../utils/createGround';
import { Depth } from '@utils/Depth';

export class SpawnSwampRoom extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'SpawnSwampRoom' });
  }

  preload(): void {}

  create(): void {
    const mapWidth = 2560;
    const { body: groundBody, width: groundWidth } = createGround(
      this,
      mapWidth,
    );

    const GROUND_SCALE = 0.1;
    const tileH = Math.round(739 * GROUND_SCALE);
    const groundTop = this.scale.height - tileH;
    this.add
      .image(mapWidth / 2, 360, 'swamp-background')
      .setDisplaySize(mapWidth, this.scale.height)
      .setDepth(Depth.FAR_BACKGROUND)
      .setAlpha(0.6);
    this.add
      .image(510, 280, 'swamp-trees-cluster')
      .setScale(0.38)
      .setDepth(Depth.BACKGROUND_2)
      .setAlpha(0.8);
    this.add
      .image(400, 417, 'swamp-trunk-broken')
      .setScale(0.2)
      .setDepth(Depth.BACKGROUND_1);
    this.add
      .image(900, 417, 'swamp-trunk-face')
      .setScale(0.2)
      .setDepth(Depth.BACKGROUND_1);

    const player = PlayerObject.create(this, 100, groundTop - 60);
    this.physics.add.collider(player, groundBody);
    PlayerCamera.setup(this, player, groundWidth);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this);
  }

  update(): void {
    this.playerService.update();
  }
}
