import { ConfigPanelService } from '@services/ConfigPanelService';

export class GameInputService {
  private configPanelService: ConfigPanelService;

  constructor(configPanelService: ConfigPanelService) {
    this.configPanelService = configPanelService;
  }

  init(scene: Phaser.Scene): void {
    scene.input.keyboard!.on('keydown-ESC', () => {
      if (this.configPanelService.open) this.configPanelService.hide();
      else this.configPanelService.openInGame(scene);
    });
  }
}
