export function createGround(
  scene: Phaser.Scene,
  mapWidth: number,
): Phaser.GameObjects.Rectangle {
  const tex = scene.textures.get('swamp-ground');
  tex.add('ground-tile', 0, 235, 349, 2322, 739);

  const SCALE = 0.06;
  const tileH = Math.round(739 * SCALE);
  const tileW = Math.round(2322 * SCALE);
  const groundY = scene.scale.height - tileH / 2;

  for (let x = tileW / 2; x < mapWidth; x += tileW) {
    scene.add.image(x, groundY, 'swamp-ground', 'ground-tile').setScale(SCALE);
  }

  const groundTop = groundY - tileH / 2;
  const body = scene.add.rectangle(mapWidth / 2, groundTop, mapWidth, 4, 0, 0);
  scene.physics.add.existing(body, true);
  return body;
}
