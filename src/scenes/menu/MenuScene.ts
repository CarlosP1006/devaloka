import startMenu from '@assets/menu/images/start-menu.png';
import menuButtonStart from '@assets/menu/images/menu-button-start.png';
import menuButtonNewGame from '@assets/menu/images/menu-button-new-game.png';
import menuButtonContinue from '@assets/menu/images/menu-button-continue.png';
import devalokaMenu from '@assets/menu/images/devaloka-menu.png';
import playerImg from '@assets/player/images/player.png';
import playerJump from '@assets/player/audio/player-jump.ogg';
import { loadPlayerAnimations } from '@objects/player/PlayerLoader';
import { container } from '@containers/index';
import { AudioManagerService } from '@services/AudioManagerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { ConfigPanelService } from '@services/ConfigPanelService';

const ROOM_TO_LOADER: Record<string, string> = {
  SpawnSwampRoom: 'SwampLoaderScene',
};

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload(): void {
    this.load.image('start-menu', startMenu);
    this.load.image('menu-button-start', menuButtonStart);
    this.load.image('menu-button-new-game', menuButtonNewGame);
    this.load.image('menu-button-continue', menuButtonContinue);
    this.load.image('devaloka-menu', devalokaMenu);
    this.load.spritesheet('player', playerImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.audio('player-jump', playerJump);
  }

  create(): void {
    loadPlayerAnimations(this);
    const audioManagerService = container.resolve<AudioManagerService>(
      'audioManagerService',
    );
    audioManagerService.init(this);
    const saveManagerService =
      container.resolve<SaveManagerService>('saveManagerService');
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.add
      .image(cx, cy, 'start-menu')
      .setDisplaySize(this.scale.width, this.scale.height);

    this.add.image(cx, -120, 'devaloka-menu').setOrigin(0.5, 0).setScale(1.3);

    const savedConfig = saveManagerService.get()?.config;
    audioManagerService.setVolume(savedConfig?.volume ?? 0.5);
    if (savedConfig?.isMuted) audioManagerService.mute();

    const configPanelService =
      container.resolve<ConfigPanelService>('configPanelService');
    configPanelService.init(this);

    const configBtn = this.add
      .text(20, this.scale.height - 20, 'CONFIG', {
        fontSize: '14px',
        color: '#ffffff',
      })
      .setOrigin(0, 1)
      .setInteractive({ useHandCursor: true });

    configBtn.on('pointerdown', () => configPanelService.show());

    const btnNewGame = this.add
      .image(cx, cy + 60, 'menu-button-new-game')
      .setDisplaySize(240, 131)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    const btnContinue = this.add
      .image(cx, cy + 200, 'menu-button-continue')
      .setDisplaySize(216, 118)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    const button = this.add
      .image(cx, cy + 150, 'menu-button-start')
      .setScale(0.4)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setScale(0.44));
    button.on('pointerout', () => button.setScale(0.4));
    button.on('pointerdown', () => {
      button.setVisible(false);
      btnNewGame.setVisible(true);
      btnContinue.setVisible(true);
    });

    btnNewGame.on('pointerover', () => btnNewGame.setDisplaySize(264, 144));
    btnNewGame.on('pointerout', () => btnNewGame.setDisplaySize(240, 131));
    btnNewGame.on('pointerdown', () => {
      saveManagerService.clear();
      this.scene.start('SwampLoaderScene');
    });

    btnContinue.on('pointerover', () => btnContinue.setDisplaySize(238, 130));
    btnContinue.on('pointerout', () => btnContinue.setDisplaySize(216, 118));
    btnContinue.on('pointerdown', () => {
      const save = saveManagerService.get();
      const room = save?.location?.room ?? 'SpawnSwampRoom';
      const loader = ROOM_TO_LOADER[room] ?? 'SwampLoaderScene';
      this.scene.start(loader);
    });
  }
}
