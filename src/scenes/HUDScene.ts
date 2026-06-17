import { container } from '@containers/index';
import { PlayerService } from '@objects/player/services/PlayerService';

const BAR_X = 5;
const BAR_Y = 5;
const BAR_W = 150;
const BAR_H = 10;

export class HUDScene extends Phaser.Scene {
  private barGfx!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'HUDScene' });
  }

  create(): void {
    this.barGfx = this.add.graphics();
  }

  update(): void {
    const ps = container.resolve<PlayerService>('playerService');
    if (!ps.isSlingBarVisible()) {
      this.barGfx.clear();
      return;
    }
    const fill = ps.getSlingBarFill();
    this.barGfx.clear();
    this.barGfx.fillStyle(0x333333, 1);
    this.barGfx.fillRect(BAR_X, BAR_Y, BAR_W, BAR_H);
    this.barGfx.fillStyle(0xffdd00, 1);
    this.barGfx.fillRect(BAR_X, BAR_Y, BAR_W * fill, BAR_H);
  }
}
