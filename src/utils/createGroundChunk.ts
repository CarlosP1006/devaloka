import { Depth } from '@utils/Depth';

export const TILE_SRC_W = 2322;
export const TILE_SRC_H = 739;
export const TOTAL_TILES_VERTICAL = 14;
export const LOGICAL_HEIGHT = 720;
export const MAP_WIDTH = 2560;

export function getTileSize(_scene: Phaser.Scene): {
  tileH: number;
  tileW: number;
  groundScale: number;
  groundTop: number;
} {
  const tileH = LOGICAL_HEIGHT / TOTAL_TILES_VERTICAL;
  const tileW = Math.round(TILE_SRC_W * 0.06);
  const groundScale = tileH / TILE_SRC_H;
  const groundTop = LOGICAL_HEIGHT - tileH;
  return { tileH, tileW, groundScale, groundTop };
}

function addSegment(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.StaticGroup,
  centerX: number,
  groundTop: number,
  startIdx: number,
  endIdx: number,
  tileH: number,
  tileW: number,
): void {
  const segH = (endIdx - startIdx + 1) * tileH;
  const segCenterY = groundTop + tileH / 2 - ((startIdx + endIdx) * tileH) / 2;
  const zone = scene.add.zone(centerX, segCenterY, tileW, segH);
  group.add(zone);
}

export function createGroundChunk(
  scene: Phaser.Scene,
  chunkX: number,
  layers: number,
  removeLayers: number[] | undefined,
  surfaceKey: string,
  dirtKey: string,
): {
  group: Phaser.Physics.Arcade.StaticGroup;
  images: Phaser.GameObjects.Image[];
} {
  const { tileH, tileW, groundTop } = getTileSize(scene);
  const centerX = tileW * chunkX + tileW / 2;
  const removeSet = new Set(removeLayers ?? []);
  const images: Phaser.GameObjects.Image[] = [];

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
      images.push(
        scene.add
          .image(
            centerX,
            groundTop + tileH / 2 - i * tileH,
            dirtKey,
            'dirt-tile',
          )
          .setDisplaySize(tileW, tileH)
          .setDepth(Depth.MAIN),
      );
    }
  }

  images.push(
    scene.add
      .image(
        centerX,
        groundTop + tileH / 2 - layers * tileH,
        surfaceKey,
        'ground-tile',
      )
      .setDisplaySize(tileW, tileH)
      .setDepth(Depth.MAIN),
  );

  const group = scene.physics.add.staticGroup();
  let segStart: number | null = null;

  for (let i = 0; i <= layers; i++) {
    const present = i === layers || !removeSet.has(i);

    if (present && segStart === null) {
      segStart = i;
    } else if (!present && segStart !== null) {
      addSegment(
        scene,
        group,
        centerX,
        groundTop,
        segStart,
        i - 1,
        tileH,
        tileW,
      );
      segStart = null;
    }
  }

  if (segStart !== null) {
    addSegment(
      scene,
      group,
      centerX,
      groundTop,
      segStart,
      layers,
      tileH,
      tileW,
    );
  }

  return { group, images };
}
