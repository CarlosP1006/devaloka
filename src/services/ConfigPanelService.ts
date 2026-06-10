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

  constructor(
    audioManagerService: AudioManagerService,
    saveManagerService: SaveManagerService,
  ) {
    this.audioManagerService = audioManagerService;
    this.saveManagerService = saveManagerService;
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
    const panelW = 400;
    const panelH = 220;
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

    const mainBg = scene.add
      .rectangle(cx, cy, panelW, panelH, 0x000000, 0.88)
      .setDepth(D)
      .setVisible(false);
    const mainTitle = scene.add
      .text(cx, cy - 80, 'CONFIGURAÇÕES', {
        fontSize: '18px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(D)
      .setVisible(false);
    const mainBtnVolume = scene.add
      .text(cx, cy, 'VOLUME', { fontSize: '16px', color: '#4488ff' })
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);
    const mainClose = scene.add
      .text(cx + panelW / 2 - 16, cy - panelH / 2 + 16, 'X', {
        fontSize: '18px',
        color: '#ff4444',
      })
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);
    this.mainPanel = [mainBg, mainTitle, mainBtnVolume, mainClose];

    const volBg = scene.add
      .rectangle(cx, cy, panelW, panelH, 0x000000, 0.88)
      .setDepth(D)
      .setVisible(false);
    const volTitle = scene.add
      .text(cx, cy - 80, 'VOLUME', { fontSize: '18px', color: '#ffffff' })
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
    const volPct = scene.add
      .text(
        trackX + trackW + 12,
        trackY,
        `${Math.round(currentVolume * 100)}%`,
        { fontSize: '13px', color: '#ffffff' },
      )
      .setOrigin(0, 0.5)
      .setDepth(D)
      .setVisible(false);
    const muteBtn = scene.add
      .text(cx, trackY + 50, muted ? 'UNMUTE' : 'MUTE', {
        fontSize: '15px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);
    const volClose = scene.add
      .text(cx + panelW / 2 - 16, cy - panelH / 2 + 16, 'X', {
        fontSize: '18px',
        color: '#ff4444',
      })
      .setOrigin(0.5)
      .setDepth(D)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);
    this.volPanel = [
      volBg,
      volTitle,
      trackBg,
      trackFill,
      handle,
      volPct,
      muteBtn,
      volClose,
    ];

    scene.input.setDraggable(handle);
    handle.on('drag', (_p: Phaser.Input.Pointer, dragX: number) => {
      const clampedX = Phaser.Math.Clamp(dragX, trackX, trackX + trackW);
      handle.x = clampedX;
      currentVolume = (clampedX - trackX) / trackW;
      trackFill.setSize(clampedX - trackX, 6);
      volPct.setText(`${Math.round(currentVolume * 100)}%`);
      muted = false;
      muteBtn.setText('MUTE');
      this.audioManagerService.unmute();
      this.audioManagerService.setVolume(currentVolume);
      this.saveManagerService.save({
        config: { volume: currentVolume, isMuted: false },
      });
    });

    muteBtn.on('pointerdown', () => {
      if (muted) {
        muted = false;
        muteBtn.setText('MUTE');
        this.audioManagerService.unmute();
        this.audioManagerService.setVolume(preMuteVolume);
        currentVolume = preMuteVolume;
        handle.x = trackX + preMuteVolume * trackW;
        trackFill.setSize(preMuteVolume * trackW, 6);
        volPct.setText(`${Math.round(preMuteVolume * 100)}%`);
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

    mainBtnVolume.on('pointerdown', () => {
      hide(this.mainPanel);
      show(this.volPanel);
    });
    mainClose.on('pointerdown', () => this.hide());
    volClose.on('pointerdown', () => this.hide());
  }

  openInGame(gameScene: Phaser.Scene): void {
    if (this.isOpen) return;
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
    }
    this.mainPanel = [];
    this.volPanel = [];
    if (this.pausedScene) {
      this.pausedScene.sound.resumeAll();
      this.pausedScene.scene.resume();
      this.pausedScene = null;
    }
  }
}
