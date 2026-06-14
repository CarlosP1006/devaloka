import { Depth } from '@utils/Depth';
import { makeStoneButton } from '@utils/ButtonHelper';

export class ItemRevealScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ItemRevealScene' });
  }

  create(data: {
    resumeKey: string;
    itemKey: string;
    itemScaleX: number;
    itemScaleY: number;
    description: string;
    onClose?: () => void;
  }): void {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const D = Depth.CONFIG;

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
    this.add
      .rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.6)
      .setDepth(D - 1);

    this.add.image(cx, cy, 'config-panel').setDisplaySize(630, 441).setDepth(D);

    this.add
      .text(cx, cy - 80, data.description, {
        fontSize: '16px',
        color: '#00ddff',
        align: 'center',
        wordWrap: { width: 400 },
      })
      .setOrigin(0.5)
      .setDepth(D + 1);

    this.add
      .image(cx, cy + 10, 'item-frame')
      .setScale(0.32)
      .setDepth(D + 1);

    this.add
      .image(cx, cy + 10, data.itemKey)
      .setScale(data.itemScaleX, data.itemScaleY)
      .setDepth(D + 2);

    const close = () => {
      this.scene.stop();
      this.scene.resume(data.resumeKey);
      this.scene.get(data.resumeKey).sound.resumeAll();
      data.onClose?.();
    };

    const [, sairTxt] = makeStoneButton(
      this,
      cx,
      cy + 100,
      0.32,
      0.24,
      D,
      'SAIR',
      '#ff3333',
      close,
      '24px',
    );
    sairTxt.setY(cy + 99);
  }
}
