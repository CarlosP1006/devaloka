import { SaveManagerService } from '@services/SaveManagerService';
import { GlobalSaveService } from '@services/GlobalSaveService';
import { makeStoneButton } from '@utils/ButtonHelper';
import { SaveSlotKey, SLOT_KEYS } from '../types/declarations/SaveSlotKey';
import { CHAPTER_NAMES } from '../types/declarations/ChapterTypes';
import { Depth } from '@utils/Depth';

const ROOM_TO_LOADER: Record<string, string> = {
  SpawnSwampRoom: 'SwampLoaderScene',
};

export class SaveSlotPanelService {
  private saveManagerService: SaveManagerService;
  private globalSaveService: GlobalSaveService;
  private panelObjects: Phaser.GameObjects.GameObject[] = [];
  private domInput: Phaser.GameObjects.DOMElement | null = null;

  constructor(
    saveManagerService: SaveManagerService,
    globalSaveService: GlobalSaveService,
  ) {
    this.saveManagerService = saveManagerService;
    this.globalSaveService = globalSaveService;
  }

  private destroyPanel(): void {
    this.panelObjects.forEach(o => o.destroy());
    this.panelObjects = [];
    if (this.domInput) {
      this.domInput.destroy();
      this.domInput = null;
    }
  }

  private getSlots() {
    return SLOT_KEYS.map((key, i) => ({
      key,
      label: `Slot ${i + 1}`,
      data: this.saveManagerService.loadSlot(key),
    }));
  }

  private buildBase(scene: Phaser.Scene) {
    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;
    const panelW = 630;
    const panelH = 441;
    const D = Depth.CONFIG;
    const border = scene.add
      .image(cx, cy, 'config-panel')
      .setDisplaySize(panelW, panelH)
      .setDepth(D);
    this.panelObjects.push(border);
    return { cx, cy, D };
  }

  private addBackBtn(
    scene: Phaser.Scene,
    cx: number,
    y: number,
    D: number,
    onClick: () => void,
  ): void {
    const [bg, txt] = makeStoneButton(
      scene,
      cx,
      y,
      0.3,
      0.22,
      D,
      'VOLTAR',
      '#ff3333',
      onClick,
      '15px',
    );
    this.panelObjects.push(bg, txt);
  }

  showNewGame(
    scene: Phaser.Scene,
    onClose: () => void,
    onStart: (loader: string) => void,
  ): void {
    this.destroyPanel();
    const slots = this.getSlots();
    const occupied = slots.filter(s => s.data !== null);
    if (occupied.length < 3) {
      this.buildNameInput(scene, onClose, onStart);
    } else {
      this.buildSlotsFullPanel(scene, onClose, onStart);
    }
  }

  showContinue(
    scene: Phaser.Scene,
    onClose: () => void,
    onStart: (loader: string) => void,
  ): void {
    this.destroyPanel();
    this.buildContinuePanel(scene, onClose, onStart);
  }

  private buildNameInput(
    scene: Phaser.Scene,
    onClose: () => void,
    onStart: (loader: string) => void,
    targetKey?: SaveSlotKey,
  ): void {
    const { cx, cy, D } = this.buildBase(scene);

    const label = scene.add
      .image(cx, cy - 62, 'new-game-title')
      .setScale(0.35)
      .setOrigin(0.5)
      .setDepth(D);

    const domInput = scene.add
      .dom(
        cx,
        cy - 10,
        'input',
        'width:200px;padding:6px;font-size:16px;background:#1a1a2e;color:#00ddff;border:1px solid #00ddff;outline:none;text-align:center;',
      )
      .setDepth(D);
    const inputEl = domInput.node as HTMLInputElement;
    inputEl.maxLength = 20;
    inputEl.placeholder = 'Nome do jogador';
    inputEl.focus();
    inputEl.addEventListener('keydown', e => e.stopPropagation());
    this.domInput = domInput;

    const [btnCreateBg, btnCreate] = makeStoneButton(
      scene,
      cx,
      cy + 60,
      0.58,
      0.38,
      D,
      'CONFIRMAR',
      '#00ddff',
      () => {
        const name = (inputEl.value || '').trim() || 'Jogador';
        const slots = this.getSlots();
        const key =
          targetKey ??
          slots.find(s => s.data === null)?.key ??
          'devaloka_save_1';
        this.globalSaveService.save({ activeSlot: key });
        this.saveManagerService.reloadActiveSlot();
        this.saveManagerService.save({
          slotInfo: { playerName: name, playTime: 0, chapter: 'swamp' },
        });
        this.destroyPanel();
        onStart('SwampLoaderScene');
      },
      '22px',
    );

    this.panelObjects.push(label, btnCreateBg, btnCreate);

    this.addBackBtn(scene, cx, cy + 110, D, () => {
      this.destroyPanel();
      onClose();
    });
  }

  private buildDeleteConfirm(
    scene: Phaser.Scene,
    slotLabel: string,
    onConfirm: () => void,
    onCancel: () => void,
  ): void {
    this.destroyPanel();
    const { cx, cy, D } = this.buildBase(scene);

    const question = scene.add
      .text(
        cx,
        cy - 40,
        `Excluir "${slotLabel}"?\nEssa ação não pode ser desfeita.`,
        { fontSize: '17px', color: '#ffffff', align: 'center' },
      )
      .setOrigin(0.5)
      .setDepth(D);

    const [btnSimBg, btnSimTxt] = makeStoneButton(
      scene,
      cx - 90,
      cy + 60,
      0.3,
      0.22,
      D,
      'SIM',
      '#ff3333',
      onConfirm,
      '16px',
    );
    const [btnNaoBg, btnNaoTxt] = makeStoneButton(
      scene,
      cx + 90,
      cy + 60,
      0.3,
      0.22,
      D,
      'NÃO',
      '#00ddff',
      onCancel,
      '16px',
    );

    this.panelObjects.push(question, btnSimBg, btnSimTxt, btnNaoBg, btnNaoTxt);
  }

  private buildSlotsFullPanel(
    scene: Phaser.Scene,
    onClose: () => void,
    onStart: (loader: string) => void,
  ): void {
    const { cx, cy, D } = this.buildBase(scene);

    const warning = scene.add
      .image(cx, cy - 108, 'slots-full-title')
      .setScale(0.4)
      .setOrigin(0.5)
      .setDepth(D);
    this.panelObjects.push(warning);

    const boxW = 200;
    const boxH = 53;
    const boxX = cx - 80;
    const slots = this.getSlots();

    slots.forEach((slot, i) => {
      const y = cy - 60 + i * 60;
      const info = slot.data?.slotInfo;
      const playerName = info?.playerName ?? slot.label;
      const chapterName = info?.chapter
        ? CHAPTER_NAMES[info.chapter] ?? info.chapter
        : '—';
      const timeStr = info
        ? this.formatTime(info.playTime)
        : this.formatTime(0);
      const half = boxW / 2;

      const boxBg = scene.add
        .rectangle(0, 0, boxW, boxH, 0x0d0d1f)
        .setOrigin(0.5);
      const boxBorder = scene.add
        .rectangle(0, 0, boxW, boxH)
        .setStrokeStyle(1, 0x223344)
        .setFillStyle()
        .setOrigin(0.5);
      const txtName = scene.add
        .text(0, -10, playerName, { fontSize: '14px', color: '#00ddff' })
        .setOrigin(0.5, 0.5);
      const txtChapter = scene.add
        .text(-half + 10, 10, chapterName, {
          fontSize: '11px',
          color: '#ffffff',
        })
        .setOrigin(0, 0.5);
      const txtTime = scene.add
        .text(half - 10, 10, timeStr, { fontSize: '11px', color: '#aaaaaa' })
        .setOrigin(1, 0.5);

      const box = scene.add.container(boxX, y, [
        boxBg,
        boxBorder,
        txtName,
        txtChapter,
        txtTime,
      ]);
      box.setDepth(D);

      const [btnDelBg, btnDelTxt] = makeStoneButton(
        scene,
        cx + 105,
        y,
        0.28,
        0.2,
        D,
        'EXCLUIR',
        '#ff3333',
        () => {
          this.buildDeleteConfirm(
            scene,
            playerName,
            () => {
              this.saveManagerService.clearSlot(slot.key);
              this.destroyPanel();
              this.buildNameInput(scene, onClose, onStart, slot.key);
            },
            () => {
              this.destroyPanel();
              this.buildSlotsFullPanel(scene, onClose, onStart);
            },
          );
        },
        '16px',
        1,
      );
      this.panelObjects.push(box, btnDelBg, btnDelTxt);
    });

    this.addBackBtn(scene, cx, cy + 111, D, () => {
      this.destroyPanel();
      onClose();
    });
  }

  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(
      2,
      '0',
    )}:${String(s).padStart(2, '0')}`;
  }

  private buildContinuePanel(
    scene: Phaser.Scene,
    onClose: () => void,
    onStart: (loader: string) => void,
  ): void {
    const { cx, cy, D } = this.buildBase(scene);

    const boxW = 200;
    const boxH = 53;
    const boxX = cx - 80;
    const slots = this.getSlots();

    slots.forEach((slot, i) => {
      const y = cy - 90 + i * 74;
      const occupied = slot.data !== null;

      if (occupied) {
        const info = slot.data!.slotInfo;
        const playerName = info?.playerName ?? slot.label;
        const chapterName = info?.chapter
          ? CHAPTER_NAMES[info.chapter] ?? info.chapter
          : '—';
        const timeStr = info
          ? this.formatTime(info.playTime)
          : this.formatTime(0);

        const half = boxW / 2;
        const boxBg = scene.add
          .rectangle(0, 0, boxW, boxH, 0x0d0d1f)
          .setOrigin(0.5);
        const boxBorder = scene.add
          .rectangle(0, 0, boxW, boxH)
          .setStrokeStyle(1, 0x223344)
          .setFillStyle()
          .setOrigin(0.5);
        const txtName = scene.add
          .text(0, -10, playerName, { fontSize: '14px', color: '#00ddff' })
          .setOrigin(0.5, 0.5);
        const txtChapter = scene.add
          .text(-half + 10, 10, chapterName, {
            fontSize: '11px',
            color: '#ffffff',
          })
          .setOrigin(0, 0.5);
        const txtTime = scene.add
          .text(half - 10, 10, timeStr, { fontSize: '11px', color: '#aaaaaa' })
          .setOrigin(1, 0.5);

        const box = scene.add.container(boxX, y, [
          boxBg,
          boxBorder,
          txtName,
          txtChapter,
          txtTime,
        ]);
        box.setDepth(D);
        box.setSize(boxW, boxH);
        box.setInteractive({ useHandCursor: true });
        box.on('pointerover', () => {
          if (scene.cache.audio.exists('slot-hover'))
            scene.sound.play('slot-hover', { volume: 0.1 });
          boxBg.setFillStyle(0x16163a);
          boxBorder.setStrokeStyle(1, 0x00ddff);
        });
        box.on('pointerout', () => {
          boxBg.setFillStyle(0x0d0d1f);
          boxBorder.setStrokeStyle(1, 0x223344);
        });
        box.on('pointerdown', () => {
          this.globalSaveService.save({ activeSlot: slot.key });
          this.saveManagerService.reloadActiveSlot();
          const room = slot.data?.location?.room ?? 'SpawnSwampRoom';
          const loader = ROOM_TO_LOADER[room] ?? 'SwampLoaderScene';
          this.destroyPanel();
          onStart(loader);
        });

        const [btnDelBg, btnDelTxt] = makeStoneButton(
          scene,
          cx + 105,
          y,
          0.28,
          0.2,
          D,
          'EXCLUIR',
          '#ff3333',
          () => {
            this.buildDeleteConfirm(
              scene,
              playerName,
              () => {
                this.saveManagerService.clearSlot(slot.key);
                this.destroyPanel();
                this.buildContinuePanel(scene, onClose, onStart);
              },
              () => {
                this.destroyPanel();
                this.buildContinuePanel(scene, onClose, onStart);
              },
            );
          },
          '16px',
          1,
        );

        this.panelObjects.push(box, btnDelBg, btnDelTxt);
      } else {
        const emptyBox = scene.add
          .rectangle(boxX, y, boxW, boxH, 0x0a0a18)
          .setOrigin(0.5)
          .setDepth(D);
        const emptyTxt = scene.add
          .text(boxX, y, `${slot.label} — VAZIO`, {
            fontSize: '13px',
            color: '#ffffff',
          })
          .setOrigin(0.5)
          .setDepth(D);
        this.panelObjects.push(emptyBox, emptyTxt);
      }
    });

    this.addBackBtn(scene, cx, cy + 110, D, () => {
      this.destroyPanel();
      onClose();
    });
  }
}
