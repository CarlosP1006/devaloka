export function createGround(
  scene: Phaser.Scene,
  mapWidth: number,
): Phaser.GameObjects.Rectangle {
  const tex = scene.textures.get('swamp-ground');
  tex.add('ground-left', 0, 234, 363, 751, 739);
  tex.add('ground-middle', 0, 1020, 363, 775, 739);
  tex.add('ground-right', 0, 1830, 363, 751, 739);

  const SCALE = 0.06;
  const tileH = Math.round(739 * SCALE);
  const leftW = Math.round(751 * SCALE);
  const midW = Math.round(775 * SCALE);
  const groundY = scene.scale.height - tileH / 2;

  const groupW = leftW + midW + leftW;
  for (let gx = 0; gx < mapWidth; gx += groupW) {
    scene.add
      .image(gx + leftW / 2, groundY, 'swamp-ground', 'ground-left')
      .setScale(SCALE);
    scene.add
      .image(gx + leftW + midW / 2, groundY, 'swamp-ground', 'ground-middle')
      .setScale(SCALE);
    scene.add
      .image(
        gx + leftW + midW + leftW / 2,
        groundY,
        'swamp-ground',
        'ground-right',
      )
      .setScale(SCALE);
  }

  const groundTop = groundY - tileH / 2;
  const body = scene.add.rectangle(mapWidth / 2, groundTop, mapWidth, 4, 0, 0);
  scene.physics.add.existing(body, true);
  return body;
}
