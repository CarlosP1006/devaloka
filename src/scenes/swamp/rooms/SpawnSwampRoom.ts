import { container } from '../../../containers';
import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { PlayerCamera } from '@objects/player/utils/PlayerCamera';
import { PlayerService } from '@objects/player/services/PlayerService';
import { createGround } from '../utils/createGround';

export class SpawnSwampRoom extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'SpawnSwampRoom' });
  }

  preload(): void {}

  create(): void {
    const mapWidth = 2560;
    const { body: groundBody, width: groundWidth } = createGround(this, mapWidth);

    const GROUND_SCALE = 0.06;
    const tileH = Math.round(739 * GROUND_SCALE);
    const groundTop = this.scale.height - tileH;
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
