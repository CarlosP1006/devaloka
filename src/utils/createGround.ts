import { Depth } from '@utils/Depth';
import { getTileSize, TILE_SRC_W, TILE_SRC_H } from '@utils/createGroundChunk';

export function createGround(
  scene: Phaser.Scene,
  surfaceKey: string,
  removeChunks?: number[],
): { group: Phaser.Physics.Arcade.StaticGroup } {
  const mapWidth = 2560;
  const { tileH, tileW } = getTileSize(scene);
  const tex = scene.textures.get(surfaceKey);
  if (!tex.has('ground-tile')) {
    tex.add('ground-tile', 0, 0, 0, TILE_SRC_W, TILE_SRC_H);
  }

  const groundY = scene.scale.height - tileH / 2;

  const removeSet = new Set(removeChunks ?? []);
  const group = scene.physics.add.staticGroup();

  const addSpan = (startIdx: number, endIdx: number) => {
    const startX = tileW / 2 + startIdx * tileW;
    const endX = tileW / 2 + endIdx * tileW;
    const width = endX - startX + tileW;
    const centerX = (startX + endX) / 2;
    const zone = scene.add.zone(centerX, groundY, width, tileH);
    group.add(zone);
  };

  let index = 0;
  let spanStart: number | null = null;
  for (let x = tileW / 2; x < mapWidth + tileW; x += tileW) {
    const present = !removeSet.has(index);
    if (present) {
      scene.add
        .image(x, groundY, surfaceKey, 'ground-tile')
        .setDisplaySize(tileW, tileH)
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
