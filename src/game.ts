import 'phaser';
import { MenuScene } from '@scenes/menu/MenuScene';
import { ConfigScene } from '@scenes/config/ConfigScene';
import { HUDScene } from '@scenes/HUDScene';
import { ItemRevealScene } from '@scenes/item/ItemRevealScene';
import { LoreScene } from '@scenes/lore/LoreScene';
import { SwampLoaderScene } from '@scenes/swamp/SwampLoaderScene';
import { SpawnSwampRoom } from '@scenes/swamp/rooms/SpawnSwampRoom';
import { ForestSwampRoom } from '@scenes/swamp/rooms/ForestSwampRoom';

window.addEventListener('load', () => {
  const cfg: Phaser.Types.Core.GameConfig = {
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [
      MenuScene,
      SwampLoaderScene,
      SpawnSwampRoom,
      ForestSwampRoom,
      ConfigScene,
      HUDScene,
      ItemRevealScene,
      LoreScene,
    ],
    dom: {
      createContainer: true,
    },
    input: {
      keyboard: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          y: 1400,
        },
        debug: false, //ativa - desativa caixa de colisão
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
