export const DESIGN_HEIGHT = 720;
export const DESIGN_MAP_WIDTH = 2560;
export const TILE_SRC_W = 2322;
export const TILE_SRC_H = 739;
export const BASE_GROUND_SCALE = 0.06;

export interface RoomScale {
  factor: number;
  groundScale: number;
  tileW: number;
  tileH: number;
  groundTop: number;
  ceilingY: number;
  mapWidth: number;
  screenHeight: number;
}

export function getRoomScale(scene: Phaser.Scene): RoomScale {
  const screenHeight = scene.scale.height;
  const factor = screenHeight / DESIGN_HEIGHT;
  const groundScale = BASE_GROUND_SCALE * factor;
  const tileW = Math.round(TILE_SRC_W * groundScale);
  const tileH = Math.round(TILE_SRC_H * groundScale);
  const groundTop = screenHeight - tileH;
  const ceilingY = tileH / 2 - 9 * factor;
  const mapWidth = Math.round(DESIGN_MAP_WIDTH * factor);

  return {
    factor,
    groundScale,
    tileW,
    tileH,
    groundTop,
    ceilingY,
    mapWidth,
    screenHeight,
  };
}
