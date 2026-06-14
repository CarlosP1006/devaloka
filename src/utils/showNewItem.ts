const MAX_CHARS = 120;

export function showNewItem(
  gameScene: Phaser.Scene,
  opts: {
    itemKey: string;
    itemScaleX: number;
    itemScaleY: number;
    description: string;
    onClose?: () => void;
  },
): void {
  const description = opts.description.slice(0, MAX_CHARS);

  gameScene.sound.pauseAll();
  gameScene.sound.play('item-reveal', { volume: 0.8 });
  gameScene.scene.pause();
  gameScene.scene.launch('ItemRevealScene', {
    resumeKey: gameScene.scene.key,
    itemKey: opts.itemKey,
    itemScaleX: opts.itemScaleX,
    itemScaleY: opts.itemScaleY,
    description,
    onClose: opts.onClose,
  });
}
