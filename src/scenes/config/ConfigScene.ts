import { container } from '@containers/index';
import { ConfigPanelService } from '@services/ConfigPanelService';
import { Depth } from '@utils/Depth';

export class ConfigScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ConfigScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
    this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        this.scale.width,
        this.scale.height,
        0x000000,
        0.5,
      )
      .setDepth(Depth.CONFIG - 1);
    const configPanelService =
      container.resolve<ConfigPanelService>('configPanelService');
    configPanelService.initOverlay(this);
    this.input.keyboard!.on('keydown-ESC', () => configPanelService.hide());
  }
}
