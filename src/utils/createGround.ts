import { Depth } from '@utils/Depth';
import {
  GROUND_SCALE,
  TILE_W,
  TILE_H,
  TILE_SRC_W,
  TILE_SRC_H,
} from '@utils/createGroundChunk';

export function createGround(
  scene: Phaser.Scene,
  surfaceKey: string,
  removeChunks?: number[],
): { group: Phaser.Physics.Arcade.StaticGroup } {
  const mapWidth = 2560;
  const tex = scene.textures.get(surfaceKey);
  if (!tex.has('ground-tile')) {
    tex.add('ground-tile', 0, 0, 0, TILE_SRC_W, TILE_SRC_H);
  }

  const groundY = scene.scale.height - TILE_H / 2;

  const removeSet = new Set(removeChunks ?? []);
  const group = scene.physics.add.staticGroup();

  const addSpan = (startIdx: number, endIdx: number) => {
    const startX = TILE_W / 2 + startIdx * TILE_W;
    const endX = TILE_W / 2 + endIdx * TILE_W;
    const width = endX - startX + TILE_W;
    const centerX = (startX + endX) / 2;
    const zone = scene.add.zone(centerX, groundY, width, TILE_H);
    group.add(zone);
  };

  let index = 0;
  let spanStart: number | null = null;
  for (let x = TILE_W / 2; x < mapWidth + TILE_W; x += TILE_W) {
    const present = !removeSet.has(index);
    if (present) {
      scene.add
        .image(x, groundY, surfaceKey, 'ground-tile')
        .setScale(GROUND_SCALE)
        .setDepth(Depth.GROUND_DEFAULT);
      if (spanStart === null) spanStart = index;
    } else if (spanStart !== null) {
      addSpan(spanStart, index - 1);
      spanStart = null;
    }
    index++;
  }
  if (spanStart !== null) addSpan(spanStart, index - 1);

  return { group };
}
