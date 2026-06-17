import { Depth } from '@utils/Depth';
import {
  getTileSize,
  TILE_SRC_W,
  TILE_SRC_H,
  MAP_WIDTH,
} from '@utils/createGroundChunk';

export function createCeiling(
  scene: Phaser.Scene,
  surfaceKey: string,
  removeChunks?: number[],
): {
  group: Phaser.Physics.Arcade.StaticGroup;
  images: Phaser.GameObjects.Image[];
} {
  const { tileH, tileW } = getTileSize(scene);
  const tex = scene.textures.get(surfaceKey);
  if (!tex.has('ceiling-tile')) {
    tex.add('ceiling-tile', 0, 0, 0, TILE_SRC_W, TILE_SRC_H);
  }

  const ceilingY = tileH / 2 + 1;
  const removeSet = new Set(removeChunks ?? []);
  const group = scene.physics.add.staticGroup();
  const images: Phaser.GameObjects.Image[] = [];

  const addSpan = (startIdx: number, endIdx: number) => {
    const startX = tileW / 2 + startIdx * tileW;
    const endX = tileW / 2 + endIdx * tileW;
    const width = endX - startX + tileW;
    const centerX = (startX + endX) / 2;
    const zone = scene.add.zone(centerX, ceilingY, width, tileH);
    group.add(zone);
  };

  let index = 0;
  let spanStart: number | null = null;
  for (let x = tileW / 2; x < MAP_WIDTH + tileW; x += tileW) {
    const present = !removeSet.has(index);
    if (present) {
      images.push(
        scene.add
          .image(x, ceilingY, surfaceKey, 'ceiling-tile')
          .setDisplaySize(tileW + 1, tileH)
          .setDepth(Depth.GROUND_DEFAULT),
      );
      if (spanStart === null) spanStart = index;
    } else if (spanStart !== null) {
      addSpan(spanStart, index - 1);
      spanStart = null;
    }
    index++;
  }
  if (spanStart !== null) addSpan(spanStart, index - 1);

  return { group, images };
}
