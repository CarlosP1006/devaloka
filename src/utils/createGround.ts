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

  let index = 0;
  for (let x = TILE_W / 2; x < mapWidth + TILE_W; x += TILE_W) {
    if (!removeSet.has(index)) {
      scene.add
        .image(x, groundY, surfaceKey, 'ground-tile')
        .setScale(GROUND_SCALE)
        .setDepth(Depth.GROUND_DEFAULT);

      const body = scene.add.rectangle(x, groundY, TILE_W, TILE_H, 0, 0);
      group.add(body);
    }
    index++;
  }

  return { group };
}
