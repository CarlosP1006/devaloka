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
import menuMusicOnImg from '@assets/menu/images/menu-music-on.png';
import menuMusicOffImg from '@assets/menu/images/menu-music-off.png';
import menuConfirmTitleImg from '@assets/menu/images/menu-confirm-title.png';
import newGameTitleImg from '@assets/menu/images/new-game-title.png';
import slotsFullTitleImg from '@assets/menu/images/slots-full-title.png';
import menuMusicSfx from '@assets/menu/audio/menu-music.ogg';
import stoneClickSfx from '@assets/menu/audio/stone-click.ogg';
import slotHoverSfx from '@assets/menu/audio/slot-hover.ogg';
import shieldSwordImg from '@assets/player/images/shield-sword.png';
import shieldSwordBreakImg from '@assets/player/images/shield-sword-break.png';
import playerImg from '@assets/player/images/player.png';
import playerSwordImg from '@assets/player/images/player-sword.png';
import playerSlingImg from '@assets/player/images/player-sling.png';
import itemFrame from '@assets/player/images/item-frame.png';
import swordIcon from '@assets/player/images/sword-icon.png';
import playerJump from '@assets/player/audio/player-jump.ogg';
import swordSwingSfx from '@assets/player/audio/sword-swing.ogg';
import itemRevealSfx from '@assets/player/audio/item-reveal.ogg';
import { loadPlayerAnimations } from '@objects/player/PlayerLoader';
import { container } from '@containers/index';
import { AudioManagerService } from '@services/AudioManagerService';
import { GlobalSaveService } from '@services/GlobalSaveService';
import { ConfigPanelService } from '@services/ConfigPanelService';
import { SaveSlotPanelService } from '@services/SaveSlotPanelService';

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
    this.load.image('menu-music-on', menuMusicOnImg);
    this.load.image('menu-music-off', menuMusicOffImg);
    this.load.image('menu-confirm-title', menuConfirmTitleImg);
    this.load.image('new-game-title', newGameTitleImg);
    this.load.image('slots-full-title', slotsFullTitleImg);
    this.load.image('shield-sword', shieldSwordImg);
    this.load.spritesheet('shield-sword-break', shieldSwordBreakImg, {
      frameWidth: 290,
      frameHeight: 287,
    });
    this.load.spritesheet('player', playerImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('player-sling', playerSlingImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('player-sword-big', playerSwordImg, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.audio('menu-music', menuMusicSfx);
    this.load.audio('stone-click', stoneClickSfx);
    this.load.audio('slot-hover', slotHoverSfx);
    this.load.image('item-frame', itemFrame);
    this.load.image('sword-icon', swordIcon);
    this.load.audio('player-jump', playerJump);
    this.load.audio('sword-swing', swordSwingSfx);
    this.load.audio('item-reveal', itemRevealSfx);
  }

  create(): void {
    if (!this.anims.exists('idle')) loadPlayerAnimations(this);
    const audioManagerService = container.resolve<AudioManagerService>(
      'audioManagerService',
    );
    audioManagerService.init(this);
    const globalSaveService =
      container.resolve<GlobalSaveService>('globalSaveService');
    const saveSlotPanelService = container.resolve<SaveSlotPanelService>(
      'saveSlotPanelService',
    );
    const savedConfig = globalSaveService.get()?.config;
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    let musicMuted = savedConfig?.musicMenuIsMuted ?? false;
    const music = this.sound.add('menu-music', { loop: true, volume: 0.5 });
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
      this.sound.play('stone-click', { volume: 0.6 });
      if (!configPanelService.open) lockMenuBtns();
      configPanelService.toggle();
    });

    btnStart.on('pointerover', () => btnStart.setScale(0.44));
    btnStart.on('pointerout', () => btnStart.setScale(0.4));
    btnStart.on('pointerdown', () => {
      this.sound.play('stone-click', { volume: 0.6 });
      btnStart.setVisible(false);
      btnNewGame.setVisible(true);
      btnContinue.setVisible(true);
    });

    btnNewGame.on('pointerover', () => btnNewGame.setScale(0.39));
    btnNewGame.on('pointerout', () => btnNewGame.setScale(0.35));
    btnNewGame.on('pointerdown', () => {
      this.sound.play('stone-click', { volume: 0.6 });
      lockMenuBtns();
      saveSlotPanelService.showNewGame(this, unlockMenuBtns, loader => {
        music.stop();
        this.scene.start(loader, {});
      });
    });

    btnContinue.on('pointerover', () => btnContinue.setScale(0.35));
    btnContinue.on('pointerout', () => btnContinue.setScale(0.31));
    btnContinue.on('pointerdown', () => {
      this.sound.play('stone-click', { volume: 0.6 });
      lockMenuBtns();
      saveSlotPanelService.showContinue(this, unlockMenuBtns, loader => {
        music.stop();
        this.scene.start(loader, {});
      });
    });
  }
}
