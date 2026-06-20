import { Depth } from '@utils/Depth';
import { makeStoneButton } from '@utils/ButtonHelper';

export class LoreScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoreScene' });
  }

  create(data: {
    resumeKey: string;
    paragraphs: string[];
    onClose?: () => void;
  }): void {
    const D = Depth.CONFIG;
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');

    this.add
      .rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.82)
      .setDepth(D - 1);

    const panelH = Math.min(490, this.scale.height - 10);
    const panelW = Math.min(560, this.scale.width - 10);
    this.add
      .image(cx, cy, 'config-panel')
      .setDisplaySize(panelW, panelH)
      .setDepth(D);

    const winW = Math.min(380, panelW - 80);
    const winX = cx - winW / 2;
    const winY = cy - panelH / 2 + 110;
    const winH = panelH - 110 - 120;
    const btnY = cy + panelH / 2 - 118;

    const maskGfx = this.add.graphics();
    maskGfx.fillStyle(0xffffff);
    maskGfx.fillRect(winX, winY, winW, winH);
    const mask = maskGfx.createGeometryMask();
    maskGfx.setVisible(false);

    const scrollContainer = this.add.container(winX, winY);
    scrollContainer.setDepth(D + 1);
    scrollContainer.setMask(mask);

    const paraStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '15px',
      color: '#e8d5b0',
      wordWrap: { width: winW - 20 },
      lineSpacing: 5,
      align: 'center',
    };

    const GAP = 22;
    const textObjects: Phaser.GameObjects.Text[] = [];
    for (const para of data.paragraphs) {
      const t = this.add.text(winW / 2, 0, para, paraStyle).setOrigin(0.5, 0);
      scrollContainer.add(t);
      textObjects.push(t);
    }

    const maxScrollY = winY;
    let minScrollY = winY;
    let scrollEnabled = false;

    const bgMusic = this.sound.add('menu-music', { loop: true, volume: 0.1 });
    bgMusic.play();

    const close = () => {
      bgMusic.stop();
      data.onClose?.();
      this.scene.stop();
      this.scene.resume(data.resumeKey);
      this.scene.get(data.resumeKey).sound.resumeAll();
    };

    const [btnBg, btnTxt] = makeStoneButton(
      this,
      cx,
      btnY,
      0.3,
      0.22,
      D + 1,
      'CONTINUAR',
      '#00ddff',
      close,
      '16px',
    );
    btnBg.setAlpha(0).disableInteractive();
    btnTxt.setAlpha(0);

    let buttonShown = false;

    const arrowTxt = this.add
      .text(winX + winW - 8, winY + winH + 3, '▼', {
        fontSize: '13px',
        color: '#e8d5b0',
      })
      .setOrigin(1, 0)
      .setAlpha(0.5)
      .setDepth(D + 2);

    this.tweens.add({
      targets: arrowTxt,
      alpha: 0.1,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    const showBtn = () => {
      if (buttonShown) return;
      buttonShown = true;
      this.tweens.add({ targets: [btnBg, btnTxt], alpha: 1, duration: 400 });
      btnBg.setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: arrowTxt, alpha: 0, duration: 300 });
    };

    this.time.delayedCall(50, () => {
      let y = 10;
      for (const t of textObjects) {
        t.setY(y);
        y += t.height + GAP;
      }
      const totalH = y;
      minScrollY = winY - Math.max(0, totalH - winH);
      scrollEnabled = true;
      if (totalH <= winH) showBtn();
    });

    let isDragging = false;
    let dragStartY = 0;
    let containerStartY = winY;

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      isDragging = true;
      dragStartY = p.y;
      containerStartY = scrollContainer.y;
    });

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!isDragging || !scrollEnabled) return;
      const newY = Phaser.Math.Clamp(
        containerStartY + (p.y - dragStartY),
        minScrollY,
        maxScrollY,
      );
      scrollContainer.y = newY;
      if (newY <= minScrollY + 5) showBtn();
    });

    this.input.on('pointerup', () => {
      isDragging = false;
    });

    this.input.on(
      'wheel',
      (
        _p: Phaser.Input.Pointer,
        _objs: unknown,
        _dx: number,
        deltaY: number,
      ) => {
        if (!scrollEnabled) return;
        const newY = Phaser.Math.Clamp(
          scrollContainer.y - deltaY * 0.5,
          minScrollY,
          maxScrollY,
        );
        scrollContainer.y = newY;
        if (newY <= minScrollY + 5) showBtn();
      },
    );
  }
}
