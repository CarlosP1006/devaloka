import configPanelImg from '@assets/menu/images/config-panel.png';
import configTitleImg from '@assets/menu/images/config-title.png';
import volumeTitleImg from '@assets/menu/images/volume-title.png';
import menuItemBgImg from '@assets/menu/images/menu-item-bg.png';
import configBackImg from '@assets/menu/images/config-back.png';
import stoneClickSfx from '@assets/menu/audio/stone-click.ogg';
import { container } from '@containers/index';
import { ConfigPanelService } from '@services/ConfigPanelService';
import { Depth } from '@utils/Depth';

export class ConfigScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ConfigScene' });
  }

  preload(): void {
    this.load.image('config-panel', configPanelImg);
    this.load.image('config-title', configTitleImg);
    this.load.image('volume-title', volumeTitleImg);
    this.load.image('menu-item-bg', menuItemBgImg);
    this.load.image('config-back', configBackImg);
    this.load.audio('stone-click', stoneClickSfx);
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
