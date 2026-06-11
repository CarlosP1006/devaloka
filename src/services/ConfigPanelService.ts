import { AudioManagerService } from '@services/AudioManagerService';
import { GlobalSaveService } from '@services/GlobalSaveService';
import { Depth } from '@utils/Depth';

type Showable = { setVisible: (v: boolean) => void };

export class ConfigPanelService {
  private audioManagerService: AudioManagerService;
  private globalSaveService: GlobalSaveService;
  private mainPanel: Showable[] = [];
  private volPanel: Showable[] = [];
  private menuConfirmPanel: Showable[] = [];
  private pausedScene: Phaser.Scene | null = null;
  private overlayScene: Phaser.Scene | null = null;
  private isOpen = false;
  private onHideCallback: (() => void) | null = null;

  constructor(
    audioManagerService: AudioManagerService,
    globalSaveService: GlobalSaveService,
  ) {
    this.audioManagerService = audioManagerService;
    this.globalSaveService = globalSaveService;
  }

  private playClick(scene: Phaser.Scene): void {
    if (scene.cache.audio.exists('stone-click'))
      scene.sound.play('stone-click', { volume: 0.6 });
  }

  private saveConfig(volume: number, isMuted: boolean): void {
    const { musicMenuIsMuted } = this.globalSaveService.get()?.config ?? {};
    this.globalSaveService.save({
      config: { volume, isMuted, musicMenuIsMuted },
    });
  }

  init(scene: Phaser.Scene, inGame = false): void {
    this.mainPanel.forEach(o =>
      (o as unknown as Phaser.GameObjects.GameObject).destroy(),
    );
    this.volPanel.forEach(o =>
      (o as unknown as Phaser.GameObjects.GameObject).destroy(),
    );
    this.menuConfirmPanel.forEach(o =>
      (o as unknown as Phaser.GameObjects.GameObject).destroy(),
    );
    this.mainPanel = [];
    this.volPanel = [];
    this.menuConfirmPanel = [];

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;
    const panelW = 630;
    const panelH = 441;
    const trackW = 260;
    const trackX = cx - trackW / 2;
    const trackY = cy + 10;
    const D = Depth.CONFIG;

    const savedConfig = this.globalSaveService.get()?.config;
    let currentVolume = savedConfig?.volume ?? 0.5;
    let preMuteVolume = currentVolume;
    let muted = savedConfig?.isMuted ?? false;

    const show = (objects: Showable[]) =>
      objects.forEach(o => o.setVisible(true));
    const hide = (objects: Showable[]) =>
      objects.forEach(o => o.setVisible(false));

    const mainBgFill = scene.add
      .rectangle(cx, cy, panelW - 80, panelH - 60, 0x1a1a2e)
      .setDepth(D)
      .setVisible(false);
    const mainBg = scene.add
      .image(cx, cy, 'config-panel')
      .setDisplaySize(panelW, panelH)
      .setDepth(D)
      .setVisible(false);
    const mainTitle = scene.add
      .image(cx, cy - 100, 'config-title')
      .setScale(0.35)
      .setOrigin(0.5)
      .setDepth(D)
      .setVisible(false);
    const itemScaleX = 0.42;
    const itemScaleY = 0.3;
    const mainBtnVolumeBg = scene.add
      .image(cx, cy - 50, 'menu-item-bg')
      .setScale(itemScaleX, itemScaleY)
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);
    const mainBtnVolume = scene.add
      .text(cx, cy - 51, 'VOLUME', {
        fontSize: '28px',
        color: '#00ddff',
        stroke: '#00ddff',
        strokeThickness: 1.5,
      })
      .setOrigin(0.5)
      .setDepth(D)
      .setVisible(false);
    const addHover = (
      bg: Phaser.GameObjects.Image,
      sx: number,
      sy: number,
      text: Phaser.GameObjects.Text | null = null,
      factor = 1.08,
    ): void => {
      bg.on('pointerover', () => {
        bg.setScale(sx * factor, sy * factor);
        if (text) text.setScale(factor);
      });
      bg.on('pointerout', () => {
        bg.setScale(sx, sy);
        if (text) text.setScale(1);
      });
    };
    addHover(mainBtnVolumeBg, itemScaleX, itemScaleY, mainBtnVolume);
    const sairScaleX = 0.42;
    const sairScaleY = 0.3;
    const mainCloseBg = scene.add
      .image(cx, cy + 30, 'menu-item-bg')
      .setScale(sairScaleX, sairScaleY)
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);
    const mainCloseText = scene.add
      .text(cx, cy + 30, 'SAIR', {
        fontSize: '28px',
        color: '#ff3333',
        stroke: '#ff3333',
        strokeThickness: 1.5,
      })
      .setOrigin(0.5)
      .setDepth(D)
      .setVisible(false);
    addHover(mainCloseBg, sairScaleX, sairScaleY, mainCloseText);
    this.mainPanel = [
      mainBgFill,
      mainBg,
      mainTitle,
      mainBtnVolumeBg,
      mainBtnVolume,
      mainCloseBg,
      mainCloseText,
    ];

    const volBgFill = scene.add
      .rectangle(cx, cy, panelW - 80, panelH - 60, 0x1a1a2e)
      .setDepth(D)
      .setVisible(false);
    const volBg = scene.add
      .image(cx, cy, 'config-panel')
      .setDisplaySize(panelW, panelH)
      .setDepth(D)
      .setVisible(false);
    const volTitle = scene.add
      .image(cx, cy - 90, 'volume-title')
      .setScale(0.25)
      .setOrigin(0.5)
      .setDepth(D)
      .setVisible(false);
    const trackBg = scene.add
      .rectangle(cx, trackY, trackW, 6, 0x444444)
      .setDepth(D)
      .setVisible(false);
    const initialFillW = Math.max(1, currentVolume * trackW);
    const trackFill = scene.add
      .rectangle(trackX, trackY, initialFillW, 6, 0x4488ff)
      .setOrigin(0, 0.5)
      .setDepth(D)
      .setVisible(false);
    const handle = scene.add
      .rectangle(trackX + initialFillW, trackY, 14, 22, 0xffffff)
      .setDepth(D)
      .setInteractive({ draggable: true, useHandCursor: true })
      .setVisible(false);
    const muteScaleX = 0.3;
    const muteScaleY = 0.22;
    const muteBtnBg = scene.add
      .image(cx, trackY + 70, 'menu-item-bg')
      .setScale(muteScaleX, muteScaleY)
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);
    const muteColor = muted ? '#ff3333' : '#00ddff';
    const muteBtn = scene.add
      .text(cx, trackY + 70, muted ? 'DESMUTE' : 'MUTE', {
        fontSize: '15px',
        color: muteColor,
        stroke: muteColor,
        strokeThickness: 1.5,
      })
      .setOrigin(0.5)
      .setDepth(D)
      .setVisible(false);
    addHover(muteBtnBg, muteScaleX, muteScaleY, muteBtn);
    const backScale = 0.12;
    const volBack = scene.add
      .image(cx - panelW / 2 + 130, cy - panelH / 2 + 118, 'config-back')
      .setScale(backScale)
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true, pixelPerfect: true })
      .setVisible(false);
    addHover(volBack, backScale, backScale, null, 1.12);
    volBack.on('pointerdown', () => {
      this.playClick(scene);
      hide(this.volPanel);
      show(this.mainPanel);
    });
    this.volPanel = [
      volBgFill,
      volBg,
      volTitle,
      trackBg,
      trackFill,
      handle,
      muteBtnBg,
      muteBtn,
      volBack,
    ];

    scene.input.setDraggable(handle);
    handle.on('drag', (_p: Phaser.Input.Pointer, dragX: number) => {
      const clampedX = Phaser.Math.Clamp(dragX, trackX, trackX + trackW);
      handle.x = clampedX;
      currentVolume = (clampedX - trackX) / trackW;
      trackFill.setSize(clampedX - trackX, 6);
      muted = false;
      muteBtn.setText('MUTE').setColor('#00ddff').setStroke('#00ddff', 1.5);
      this.audioManagerService.unmute();
      this.audioManagerService.setVolume(currentVolume);
      this.saveConfig(currentVolume, false);
    });

    muteBtnBg.on('pointerdown', () => {
      this.playClick(scene);
      if (muted) {
        muted = false;
        muteBtn.setText('MUTE').setColor('#00ddff').setStroke('#00ddff', 1.5);
        this.audioManagerService.unmute();
        this.audioManagerService.setVolume(preMuteVolume);
        currentVolume = preMuteVolume;
        handle.x = trackX + preMuteVolume * trackW;
        trackFill.setSize(preMuteVolume * trackW, 6);
        this.saveConfig(preMuteVolume, false);
      } else {
        preMuteVolume = currentVolume;
        muted = true;
        muteBtn
          .setText('DESMUTE')
          .setColor('#ff3333')
          .setStroke('#ff3333', 1.5);
        this.audioManagerService.mute();
        this.saveConfig(currentVolume, true);
      }
    });

    mainBtnVolumeBg.on('pointerdown', () => {
      this.playClick(scene);
      hide(this.mainPanel);
      show(this.volPanel);
    });
    mainCloseBg.on('pointerdown', () => {
      this.playClick(scene);
      this.hide();
    });

    if (inGame) {
      const homeScaleX = 0.2;
      const homeScaleY = 0.17;
      const mainBtnHomeBg = scene.add
        .image(cx - panelW / 2 + 145, cy - panelH / 2 + 110, 'menu-item-bg')
        .setScale(homeScaleX, homeScaleY)
        .setOrigin(0.5)
        .setDepth(D)
        .setInteractive({ useHandCursor: true })
        .setVisible(false);
      const mainBtnHome = scene.add
        .text(cx - panelW / 2 + 145, cy - panelH / 2 + 110, 'MENU', {
          fontSize: '13px',
          color: '#00ff88',
          stroke: '#00ff88',
          strokeThickness: 0.5,
        })
        .setOrigin(0.5)
        .setDepth(D)
        .setVisible(false);
      addHover(mainBtnHomeBg, homeScaleX, homeScaleY, mainBtnHome);
      this.mainPanel.push(mainBtnHomeBg, mainBtnHome);

      const confirmBgFill = scene.add
        .rectangle(cx, cy, panelW - 80, panelH - 60, 0x1a1a2e)
        .setDepth(D)
        .setVisible(false);
      const confirmBg = scene.add
        .image(cx, cy, 'config-panel')
        .setDisplaySize(panelW, panelH)
        .setDepth(D)
        .setVisible(false);
      const confirmText = scene.add
        .image(cx, cy - 66, 'menu-confirm-title')
        .setScale(0.33)
        .setOrigin(0.5)
        .setDepth(D)
        .setVisible(false);
      const simScaleX = 0.3;
      const simScaleY = 0.22;
      const simBg = scene.add
        .image(cx - 100, cy + 40, 'menu-item-bg')
        .setScale(simScaleX, simScaleY)
        .setOrigin(0.5)
        .setDepth(D)
        .setInteractive({ useHandCursor: true })
        .setVisible(false);
      const simText = scene.add
        .text(cx - 100, cy + 40, 'SIM', {
          fontSize: '22px',
          color: '#ff3333',
          stroke: '#ff3333',
          strokeThickness: 1.5,
        })
        .setOrigin(0.5)
        .setDepth(D)
        .setVisible(false);
      addHover(simBg, simScaleX, simScaleY, simText);
      const naoScaleX = 0.3;
      const naoScaleY = 0.22;
      const naoBg = scene.add
        .image(cx + 100, cy + 40, 'menu-item-bg')
        .setScale(naoScaleX, naoScaleY)
        .setOrigin(0.5)
        .setDepth(D)
        .setInteractive({ useHandCursor: true })
        .setVisible(false);
      const naoText = scene.add
        .text(cx + 100, cy + 40, 'NÃO', {
          fontSize: '22px',
          color: '#00ddff',
          stroke: '#00ddff',
          strokeThickness: 1.5,
        })
        .setOrigin(0.5)
        .setDepth(D)
        .setVisible(false);
      addHover(naoBg, naoScaleX, naoScaleY, naoText);
      this.menuConfirmPanel = [
        confirmBgFill,
        confirmBg,
        confirmText,
        simBg,
        simText,
        naoBg,
        naoText,
      ];

      mainBtnHomeBg.on('pointerdown', () => {
        this.playClick(scene);
        hide(this.mainPanel);
        show(this.menuConfirmPanel);
      });
      naoBg.on('pointerdown', () => {
        this.playClick(scene);
        hide(this.menuConfirmPanel);
        show(this.mainPanel);
      });
      simBg.on('pointerdown', () => {
        this.playClick(scene);
        this.globalSaveService.save({});
        const gameScene = this.pausedScene!;
        this.isOpen = false;
        this.pausedScene = null;
        this.overlayScene = null;
        this.mainPanel = [];
        this.volPanel = [];
        this.menuConfirmPanel = [];
        scene.sound.stopAll();
        scene.scene.stop(gameScene.scene.key);
        scene.scene.start('MenuScene');
      });
    }
  }

  openInGame(gameScene: Phaser.Scene): void {
    if (this.isOpen) return;
    this.onHideCallback = null;
    this.pausedScene = gameScene;
    gameScene.sound.pauseAll();
    gameScene.scene.pause();
    gameScene.scene.launch('ConfigScene');
  }

  initOverlay(scene: Phaser.Scene): void {
    this.overlayScene = scene;
    this.init(scene, true);
    this.isOpen = true;
    this.mainPanel.forEach(o => o.setVisible(true));
  }

  get open(): boolean {
    return this.isOpen;
  }

  setOnHide(cb: () => void): void {
    this.onHideCallback = cb;
  }

  toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  show(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.mainPanel.forEach(o => o.setVisible(true));
  }

  hide(): void {
    this.isOpen = false;
    this.mainPanel.forEach(o => o.setVisible(false));
    this.volPanel.forEach(o => o.setVisible(false));
    this.menuConfirmPanel.forEach(o => o.setVisible(false));
    if (this.overlayScene) {
      this.overlayScene.scene.stop();
      this.overlayScene = null;
      this.mainPanel = [];
      this.volPanel = [];
      this.menuConfirmPanel = [];
    }
    if (this.pausedScene) {
      this.pausedScene.sound.resumeAll();
      this.pausedScene.scene.resume();
      this.pausedScene = null;
    }
    if (this.onHideCallback) this.onHideCallback();
  }
}
