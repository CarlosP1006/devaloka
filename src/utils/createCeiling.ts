import { Depth } from '@utils/Depth';
import {
  GROUND_SCALE,
  TILE_W,
  TILE_H,
  TILE_SRC_W,
  TILE_SRC_H,
} from '@utils/createGroundChunk';

export function createCeiling(
  scene: Phaser.Scene,
  surfaceKey: string,
  removeChunks?: number[],
): {
  group: Phaser.Physics.Arcade.StaticGroup;
  images: Phaser.GameObjects.Image[];
} {
  const mapWidth = 2560;
  const tex = scene.textures.get(surfaceKey);
  if (!tex.has('ceiling-tile')) {
    tex.add('ceiling-tile', 0, 0, 0, TILE_SRC_W, TILE_SRC_H);
  }

  const ceilingY = TILE_H / 2 - 9;
  const removeSet = new Set(removeChunks ?? []);
  const group = scene.physics.add.staticGroup();
  const images: Phaser.GameObjects.Image[] = [];

  const addSpan = (startIdx: number, endIdx: number) => {
    const startX = TILE_W / 2 + startIdx * TILE_W;
    const endX = TILE_W / 2 + endIdx * TILE_W;
    const width = endX - startX + TILE_W;
    const centerX = (startX + endX) / 2;
    const zone = scene.add.zone(centerX, ceilingY, width, TILE_H);
    group.add(zone);
  };

  let index = 0;
  let spanStart: number | null = null;
  for (let x = TILE_W / 2; x < mapWidth + TILE_W; x += TILE_W) {
    const present = !removeSet.has(index);
    if (present) {
      images.push(
        scene.add
          .image(x, ceilingY, surfaceKey, 'ceiling-tile')
          .setScale(GROUND_SCALE)
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
