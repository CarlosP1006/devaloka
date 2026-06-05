import { container } from '../containers';
import { Player } from '@objects/player/Player';
import { PlayerService } from '@services/PlayerService';

export class GameScene extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {}

  create(): void {
    const player = Player.create(this, 640, 360);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this);
  }

  update(): void {
    this.playerService.update();
  }
}
