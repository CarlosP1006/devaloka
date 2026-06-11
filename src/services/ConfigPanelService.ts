import { AudioManagerService } from '@services/AudioManagerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { Depth } from '@utils/Depth';

type Showable = { setVisible: (v: boolean) => void };

export class ConfigPanelService {
  private audioManagerService: AudioManagerService;
  private saveManagerService: SaveManagerService;
  private mainPanel: Showable[] = [];
  private volPanel: Showable[] = [];
  private pausedScene: Phaser.Scene | null = null;
  private overlayScene: Phaser.Scene | null = null;
  private isOpen = false;
  private onHideCallback: (() => void) | null = null;

  constructor(
    audioManagerService: AudioManagerService,
    saveManagerService: SaveManagerService,
  ) {
    this.audioManagerService = audioManagerService;
    this.saveManagerService = saveManagerService;
  }

  private playClick(scene: Phaser.Scene): void {
    if (scene.cache.audio.exists('stone-click'))
      scene.sound.play('stone-click', { volume: 0.6 });
  }

  init(scene: Phaser.Scene): void {
    this.mainPanel.forEach(o =>
      (o as unknown as Phaser.GameObjects.GameObject).destroy(),
    );
    this.volPanel.forEach(o =>
      (o as unknown as Phaser.GameObjects.GameObject).destroy(),
    );
    this.mainPanel = [];
    this.volPanel = [];
    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;
    const panelW = 630;
    const panelH = 441;
    const trackW = 260;
    const trackX = cx - trackW / 2;
    const trackY = cy + 10;
    const D = Depth.CONFIG;

    const savedConfig = this.saveManagerService.get()?.config;
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
    mainBtnVolumeBg.on('pointerover', () => {
      mainBtnVolumeBg.setScale(itemScaleX * 1.08, itemScaleY * 1.08);
      mainBtnVolume.setScale(1.08);
    });
    mainBtnVolumeBg.on('pointerout', () => {
      mainBtnVolumeBg.setScale(itemScaleX, itemScaleY);
      mainBtnVolume.setScale(1);
    });
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
    mainCloseBg.on('pointerover', () => {
      mainCloseBg.setScale(sairScaleX * 1.08, sairScaleY * 1.08);
      mainCloseText.setScale(1.08);
    });
    mainCloseBg.on('pointerout', () => {
      mainCloseBg.setScale(sairScaleX, sairScaleY);
      mainCloseText.setScale(1);
    });
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
    const muteBtn = scene.add
      .text(cx, trackY + 70, muted ? 'UNMUTE' : 'MUTE', {
        fontSize: '15px',
        color: '#00ddff',
        stroke: '#00ddff',
        strokeThickness: 1.5,
      })
      .setOrigin(0.5)
      .setDepth(D)
      .setVisible(false);
    muteBtnBg.on('pointerover', () => {
      muteBtnBg.setScale(muteScaleX * 1.08, muteScaleY * 1.08);
      muteBtn.setScale(1.08);
    });
    muteBtnBg.on('pointerout', () => {
      muteBtnBg.setScale(muteScaleX, muteScaleY);
      muteBtn.setScale(1);
    });
    const backScale = 0.12;
    const volBack = scene.add
      .image(cx - panelW / 2 + 130, cy - panelH / 2 + 118, 'config-back')
      .setScale(backScale)
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true, pixelPerfect: true })
      .setVisible(false);
    volBack.on('pointerover', () => volBack.setScale(backScale * 1.12));
    volBack.on('pointerout', () => volBack.setScale(backScale));
    volBack.on('pointerdown', () => {
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
      muteBtn.setText('MUTE');
      this.audioManagerService.unmute();
      this.audioManagerService.setVolume(currentVolume);
      this.saveManagerService.save({
        config: { volume: currentVolume, isMuted: false },
      });
    });

    muteBtnBg.on('pointerdown', () => {
      if (muted) {
        muted = false;
        muteBtn.setText('MUTE');
        this.audioManagerService.unmute();
        this.audioManagerService.setVolume(preMuteVolume);
        currentVolume = preMuteVolume;
        handle.x = trackX + preMuteVolume * trackW;
        trackFill.setSize(preMuteVolume * trackW, 6);
        this.saveManagerService.save({
          config: { volume: preMuteVolume, isMuted: false },
        });
      } else {
        preMuteVolume = currentVolume;
        muted = true;
        muteBtn.setText('UNMUTE');
        this.audioManagerService.mute();
        this.saveManagerService.save({
          config: { volume: currentVolume, isMuted: true },
        });
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
    volBack.on('pointerdown', () => this.playClick(scene));
    muteBtnBg.on('pointerdown', () => this.playClick(scene));
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
    this.init(scene);
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
    if (this.overlayScene) {
      this.overlayScene.scene.stop();
      this.overlayScene = null;
      this.mainPanel = [];
      this.volPanel = [];
    }
    if (this.pausedScene) {
      this.pausedScene.sound.resumeAll();
      this.pausedScene.scene.resume();
      this.pausedScene = null;
    }
    if (this.onHideCallback) this.onHideCallback();
  }
}
