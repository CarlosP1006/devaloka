import startMenu from '@assets/menu/images/start-menu.png';
import menuButtonStart from '@assets/menu/images/menu-button-start.png';
import devalokaMenu from '@assets/menu/images/devaloka-menu.png';
import playerImg from '@assets/player/images/player.png';
import playerJump from '@assets/player/audio/player-jump.ogg';
import { loadPlayerAnimations } from '@objects/player/PlayerLoader';
import { container } from '@containers/index';
import { AudioManager } from '@services/AudioManager';
import { SaveManager } from '@services/SaveManager';

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
    this.load.image('devaloka-menu', devalokaMenu);
    this.load.spritesheet('player', playerImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.audio('player-jump', playerJump);
  }

  create(): void {
    loadPlayerAnimations(this);
    container.resolve<AudioManager>('audioManager').init(this);
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.add
      .image(cx, cy, 'start-menu')
      .setDisplaySize(this.scale.width, this.scale.height);

    this.add.image(cx, -120, 'devaloka-menu').setOrigin(0.5, 0).setScale(1.3);

    const button = this.add
      .image(cx, cy + 150, 'menu-button-start')
      .setScale(0.4)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setScale(0.44));
    button.on('pointerout', () => button.setScale(0.4));
    button.on('pointerdown', () => {
      const save = container.resolve<SaveManager>('saveManager').get();
      const room = save?.location?.room ?? 'SpawnSwampRoom';
      const loader = ROOM_TO_LOADER[room] ?? 'SwampLoaderScene';
      this.scene.start(loader);
    });
  }
}
