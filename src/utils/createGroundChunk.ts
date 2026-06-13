import { Depth } from '@utils/Depth';

export const TILE_SRC_W = 2322;
export const TILE_SRC_H = 739;
export const GROUND_SCALE = 0.06;
export const TILE_W = Math.round(TILE_SRC_W * GROUND_SCALE);
export const TILE_H = Math.round(TILE_SRC_H * GROUND_SCALE);

function addSegment(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.StaticGroup,
  centerX: number,
  groundTop: number,
  startIdx: number,
  endIdx: number,
): void {
  const segH = (endIdx - startIdx + 1) * TILE_H;
  const segCenterY =
    groundTop + TILE_H / 2 - ((startIdx + endIdx) * TILE_H) / 2;
  const zone = scene.add.zone(centerX, segCenterY, TILE_W, segH);
  group.add(zone);
}

export function createGroundChunk(
  scene: Phaser.Scene,
  chunkX: number,
  layers: number,
  removeLayers: number[] | undefined,
  surfaceKey: string,
  dirtKey: string,
): { group: Phaser.Physics.Arcade.StaticGroup } {
  const centerX = TILE_W * chunkX + TILE_W / 2;
  const groundTop = scene.scale.height - TILE_H;
  const removeSet = new Set(removeLayers ?? []);

  const surfaceTex = scene.textures.get(surfaceKey);
  if (!surfaceTex.has('ground-tile')) {
    surfaceTex.add('ground-tile', 0, 0, 0, TILE_SRC_W, TILE_SRC_H);
  }

  const dirtTex = scene.textures.get(dirtKey);
  if (!dirtTex.has('dirt-tile')) {
    dirtTex.add('dirt-tile', 0, 0, 0, TILE_SRC_W, TILE_SRC_H);
  }

  for (let i = 0; i < layers; i++) {
    if (!removeSet.has(i)) {
      scene.add
        .image(
          centerX,
          groundTop + TILE_H / 2 - i * TILE_H,
          dirtKey,
          'dirt-tile',
        )
        .setScale(GROUND_SCALE)
        .setDepth(Depth.MAIN);
    }
  }

  scene.add
    .image(
      centerX,
      groundTop + TILE_H / 2 - layers * TILE_H,
      surfaceKey,
      'ground-tile',
    )
    .setScale(GROUND_SCALE)
    .setDepth(Depth.MAIN);

  const group = scene.physics.add.staticGroup();
  let segStart: number | null = null;

  for (let i = 0; i <= layers; i++) {
    const present = i === layers || !removeSet.has(i);

    if (present && segStart === null) {
      segStart = i;
    } else if (!present && segStart !== null) {
      addSegment(scene, group, centerX, groundTop, segStart, i - 1);
      segStart = null;
    }
  }

  if (segStart !== null) {
    addSegment(scene, group, centerX, groundTop, segStart, layers);
  }

  return { group };
}
