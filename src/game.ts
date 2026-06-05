import 'phaser';
import { SwampLoadingScene } from '@scenes/swamp/SwampLoadingScene';
import { SwampRoomScene } from '@scenes/swamp/SwampRoomScene';

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const cfg: Phaser.Types.Core.GameConfig = {
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [SwampLoadingScene, SwampRoomScene],
    input: {
      keyboard: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          y: 1000,
        },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#222',
    render: {
      pixelArt: true,
      antialias: false,
    },
  };

  new Game(cfg);
});
