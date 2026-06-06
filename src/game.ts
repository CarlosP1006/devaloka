import 'phaser';
import { SwampLoaderScene } from '@scenes/swamp/SwampLoaderScene';
import { SpawnSwampRoom } from '@scenes/swamp/rooms/SpawnSwampRoom';

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
    scene: [SwampLoaderScene, SpawnSwampRoom],
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
    backgroundColor: '#0d1a12',
    render: {
      pixelArt: true,
      antialias: false,
    },
  };

  new Game(cfg);
});
