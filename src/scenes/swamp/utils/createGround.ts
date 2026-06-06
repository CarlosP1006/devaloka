export function createGround(
  scene: Phaser.Scene,
  mapWidth: number,
): { body: Phaser.GameObjects.Rectangle; width: number } {
  const tex = scene.textures.get('swamp-ground');
  tex.add('ground-tile', 0, 235, 349, 2322, 739);

  const SCALE = 0.06;
  const tileH = Math.round(739 * SCALE);
  const tileW = Math.round(2322 * SCALE);
  const groundY = scene.scale.height - tileH / 2;

  let lastX = tileW / 2;
  for (let x = tileW / 2; x < mapWidth + tileW; x += tileW) {
    scene.add.image(x, groundY, 'swamp-ground', 'ground-tile').setScale(SCALE);
    lastX = x;
  }

  const actualWidth = lastX + tileW / 2;
  const groundTop = groundY - tileH / 2;
  const body = scene.add.rectangle(
    actualWidth / 2,
    groundTop,
    actualWidth,
    4,
    0,
    0,
  );
  scene.physics.add.existing(body, true);
  return { body, width: actualWidth };
}
