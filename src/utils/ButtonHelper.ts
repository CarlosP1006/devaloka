export function addStoneHover(
  bg: Phaser.GameObjects.Image,
  sx: number,
  sy: number,
  txt?: Phaser.GameObjects.Text | null,
  factor = 1.08,
): void {
  bg.on('pointerover', () => {
    bg.setScale(sx * factor, sy * factor);
    txt?.setScale(factor);
  });
  bg.on('pointerout', () => {
    bg.setScale(sx, sy);
    txt?.setScale(1);
  });
}

export function makeStoneButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  sx: number,
  sy: number,
  depth: number,
  label: string,
  color: string,
  onClick: () => void,
  fontSize = '16px',
  strokeThickness = 1.5,
): [Phaser.GameObjects.Image, Phaser.GameObjects.Text] {
  const bg = scene.add
    .image(x, y, 'menu-item-bg')
    .setScale(sx, sy)
    .setOrigin(0.5)
    .setDepth(depth)
    .setInteractive({ useHandCursor: true });
  const txt = scene.add
    .text(x, y, label, { fontSize, color, stroke: color, strokeThickness })
    .setOrigin(0.5)
    .setDepth(depth);
  addStoneHover(bg, sx, sy, txt);
  bg.on('pointerdown', () => {
    if (scene.cache.audio.exists('stone-click'))
      scene.sound.play('stone-click', { volume: 0.6 });
    onClick();
  });
  return [bg, txt];
}
