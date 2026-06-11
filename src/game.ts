import 'phaser';
import { MenuScene } from '@scenes/menu/MenuScene';
import { ConfigScene } from '@scenes/config/ConfigScene';
import { SwampLoaderScene } from '@scenes/swamp/SwampLoaderScene';
import { SpawnSwampRoom } from '@scenes/swamp/rooms/SpawnSwampRoom';

window.addEventListener('load', () => {
  const cfg: Phaser.Types.Core.GameConfig = {
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [MenuScene, SwampLoaderScene, SpawnSwampRoom, ConfigScene],
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
    backgroundColor: '#000000',
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
    },
  };

  new Phaser.Game(cfg);
});
