import { container } from '../../containers';
import { PlayerProvider } from '@providers/player/PlayerProvider';
import { PlayerService } from '@services/PlayerService';

export class SwampRoomScene extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'SwampRoomScene' });
  }

  preload(): void {}

  create(): void {
    const player = PlayerProvider.create(this, 640, 650);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this);
  }

  update(): void {
    this.playerService.update();
  }
}
