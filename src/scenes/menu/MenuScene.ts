import startMenu from '@assets/menu/images/start-menu.png';
import menuButtonStart from '@assets/menu/images/menu-button-start.png';
import menuButtonNewGame from '@assets/menu/images/menu-button-new-game.png';
import menuButtonContinue from '@assets/menu/images/menu-button-continue.png';
import devalokaMenu from '@assets/menu/images/devaloka-menu.png';
import configIconImg from '@assets/menu/images/config-icon.png';
import configPanelImg from '@assets/menu/images/config-panel.png';
import configTitleImg from '@assets/menu/images/config-title.png';
import volumeTitleImg from '@assets/menu/images/volume-title.png';
import menuItemBgImg from '@assets/menu/images/menu-item-bg.png';
import configBackImg from '@assets/menu/images/config-back.png';
import menuConfirmTitleImg from '@assets/menu/images/menu-confirm-title.png';
import menuMusicOnImg from '@assets/menu/images/menu-music-on.png';
import menuMusicOffImg from '@assets/menu/images/menu-music-off.png';
import menuMusicSfx from '@assets/menu/audio/menu-music.ogg';
import stoneClickSfx from '@assets/menu/audio/stone-click.ogg';
import playerImg from '@assets/player/images/player.png';
import playerJump from '@assets/player/audio/player-jump.ogg';
import { loadPlayerAnimations } from '@objects/player/PlayerLoader';
import { container } from '@containers/index';
import { AudioManagerService } from '@services/AudioManagerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { GlobalSaveService } from '@services/GlobalSaveService';
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
    this.load.image('menu-btnStart-start', menuButtonStart);
    this.load.image('menu-btnStart-new-game', menuButtonNewGame);
    this.load.image('menu-btnStart-continue', menuButtonContinue);
    this.load.image('devaloka-menu', devalokaMenu);
    this.load.image('config-icon', configIconImg);
    this.load.image('config-panel', configPanelImg);
    this.load.image('config-title', configTitleImg);
    this.load.image('volume-title', volumeTitleImg);
    this.load.image('menu-item-bg', menuItemBgImg);
    this.load.image('config-back', configBackImg);
    this.load.image('menu-confirm-title', menuConfirmTitleImg);
    this.load.image('menu-music-on', menuMusicOnImg);
    this.load.image('menu-music-off', menuMusicOffImg);
    this.load.spritesheet('player', playerImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.audio('menu-music', menuMusicSfx);
    this.load.audio('stone-click', stoneClickSfx);
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
    const globalSaveService =
      container.resolve<GlobalSaveService>('globalSaveService');
    const savedConfig = globalSaveService.get()?.config;
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    let musicMuted = savedConfig?.musicMenuIsMuted ?? false;
    const music = this.sound.add('menu-music', {
      loop: true,
      volume: 0.5,
    });
    if (!musicMuted) music.play();

    this.add
      .image(cx, cy, 'start-menu')
      .setDisplaySize(this.scale.width, this.scale.height);

    this.add.image(cx, 120, 'devaloka-menu').setOrigin(0.5, 0.5).setScale(0.65);

    const musicBtn = this.add
      .image(
        musicMuted ? this.scale.width - 40 : this.scale.width - 34,
        93,
        musicMuted ? 'menu-music-off' : 'menu-music-on',
      )
      .setScale(0.16)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true, pixelPerfect: true });

    musicBtn.on('pointerover', () => musicBtn.setScale(0.175));
    musicBtn.on('pointerout', () => musicBtn.setScale(0.16));
    musicBtn.on('pointerdown', () => {
      musicMuted = !musicMuted;
      musicBtn.setTexture(musicMuted ? 'menu-music-off' : 'menu-music-on');
      musicBtn.setX(musicMuted ? this.scale.width - 40 : this.scale.width - 34);
      if (musicMuted) music.stop();
      else music.play();
      const cfg = globalSaveService.get()?.config ?? {
        volume: 0.5,
        isMuted: false,
      };
      globalSaveService.save({
        config: { ...cfg, musicMenuIsMuted: musicMuted },
      });
    });

    audioManagerService.setVolume(savedConfig?.volume ?? 0.5);
    if (savedConfig?.isMuted) audioManagerService.mute();

    const configPanelService =
      container.resolve<ConfigPanelService>('configPanelService');
    configPanelService.init(this);

    const configBtn = this.add
      .image(this.scale.width - 40, 40, 'config-icon')
      .setScale(0.13)
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    configBtn.on('pointerover', () => configBtn.setScale(0.145));
    configBtn.on('pointerout', () => configBtn.setScale(0.13));

    const btnNewGame = this.add
      .image(cx, cy + 60, 'menu-btnStart-new-game')
      .setScale(0.35)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    const btnContinue = this.add
      .image(cx, cy + 200, 'menu-btnStart-continue')
      .setScale(0.31)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    const btnStart = this.add
      .image(cx, cy + 150, 'menu-btnStart-start')
      .setScale(0.4)
      .setInteractive({ useHandCursor: true });

    const lockMenuBtns = () => {
      btnStart.disableInteractive();
      btnNewGame.disableInteractive();
      btnContinue.disableInteractive();
    };
    const unlockMenuBtns = () => {
      btnStart.setInteractive({ useHandCursor: true });
      btnNewGame.setInteractive({ useHandCursor: true });
      btnContinue.setInteractive({ useHandCursor: true });
    };
    configPanelService.setOnHide(unlockMenuBtns);
    configBtn.on('pointerdown', () => {
      if (!configPanelService.open) lockMenuBtns();
      configPanelService.toggle();
    });

    btnStart.on('pointerover', () => btnStart.setScale(0.44));
    btnStart.on('pointerout', () => btnStart.setScale(0.4));
    btnStart.on('pointerdown', () => {
      btnStart.setVisible(false);
      btnNewGame.setVisible(true);
      btnContinue.setVisible(true);
    });

    btnNewGame.on('pointerover', () => btnNewGame.setScale(0.39));
    btnNewGame.on('pointerout', () => btnNewGame.setScale(0.35));
    btnNewGame.on('pointerdown', () => {
      saveManagerService.clear();
      music.stop();
      this.scene.start('SwampLoaderScene');
    });

    btnContinue.on('pointerover', () => btnContinue.setScale(0.35));
    btnContinue.on('pointerout', () => btnContinue.setScale(0.31));
    btnContinue.on('pointerdown', () => {
      const save = saveManagerService.get();
      const room = save?.location?.room ?? 'SpawnSwampRoom';
      const loader = ROOM_TO_LOADER[room] ?? 'SwampLoaderScene';
      music.stop();
      this.scene.start(loader);
    });
  }
}
