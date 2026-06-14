import { container } from '@containers/index';
import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { PlayerCamera } from '@objects/player/utils/PlayerCamera';
import { PlayerService } from '@objects/player/services/PlayerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { createGround } from '@utils/createGround';
import { createCeiling } from '@utils/createCeiling';
import { createTransitionLine } from '@utils/createTransitionLine';
import { createGroundChunk, getTileSize } from '@utils/createGroundChunk';

const mapWidth = 2560;

export class ForestSwampRoom extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'ForestSwampRoom' });
  }

  create(data: { spawnX?: number; spawnY?: number }): void {
    const { tileH, tileW, groundTop } = getTileSize(this);
    const { group: groundGroup } = createGround(this, 'swamp-ground', undefined);

    const saveManagerService = container.resolve<SaveManagerService>('saveManagerService');
    const save = saveManagerService.get();

    const savedHere = save?.location?.room === 'ForestSwampRoom';
    const spawnX = data?.spawnX ?? (savedHere ? save.location?.x ?? 300 : 300);
    const spawnY = data?.spawnY ?? (savedHere ? save.location?.y ?? groundTop - 60 : groundTop - 60);

    const { group: chunk0 } = createGroundChunk(this, 0, 8, undefined, 'swamp-ground', 'swamp-ground-dirt');
    const { group: chunk1 } = createGroundChunk(this, 1, 8, undefined, 'swamp-ground', 'swamp-ground-dirt');
    const { group: chunk2 } = createGroundChunk(this, 2, 8, undefined, 'swamp-ground', 'swamp-ground-dirt');
    const { group: chunk3 } = createGroundChunk(this, 3, 4, undefined, 'swamp-ground', 'swamp-ground-dirt');
    const { group: chunk4 } = createGroundChunk(this, 4, 4, undefined, 'swamp-ground', 'swamp-ground-dirt');
    const { group: ceilingGroup } = createCeiling(this, 'forest-swamp-ceiling');

    const thornDoorOpen = save?.sceneMods?.swamp?.forestRoom?.thornDoorOpen ?? false;
    let thornGroup: Phaser.Physics.Arcade.StaticGroup | null = null;
    let thornImages: Phaser.GameObjects.Image[] = [];
    let thornCollider: Phaser.Physics.Arcade.Collider | null = null;

    if (!thornDoorOpen) {
      const thorn = createGroundChunk(this, 2, 12, [0, 1, 2, 3, 4, 5, 6, 7, 8], 'forest-swamp-ground-surface', 'forest-swamp-ground-thorns');
      thornGroup = thorn.group;
      thornImages = thorn.images;
    }

    const player = PlayerObject.create(this, spawnX, spawnY);
    this.physics.add.collider(player, [groundGroup, chunk0, chunk1, chunk2, chunk3, chunk4, ceilingGroup]);
    if (thornGroup) thornCollider = this.physics.add.collider(player, thornGroup);

    const btnX = tileW * 2 + tileW / 2;
    const btnY = groundTop - 10 * tileH;
    const btn = this.add.text(btnX, btnY, thornDoorOpen ? '[parede: aberta]' : '[parede: fechada]', {
      fontSize: '14px', color: '#ffff00', backgroundColor: '#333333', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setDepth(100).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      const current = saveManagerService.get()?.sceneMods?.swamp?.forestRoom?.thornDoorOpen ?? false;
      const next = !current;
      saveManagerService.save({ sceneMods: { swamp: { forestRoom: { thornDoorOpen: next } } } });
      if (next) {
        thornCollider?.destroy();
        thornCollider = null;
        thornImages.forEach(img => img.destroy());
        thornGroup?.destroy(true);
        thornGroup = null;
        thornImages = [];
      } else {
        const thorn = createGroundChunk(this, 2, 12, [0, 1, 2, 3, 4, 5, 6, 7, 8], 'forest-swamp-ground-surface', 'forest-swamp-ground-thorns');
        thornGroup = thorn.group;
        thornImages = thorn.images;
        thornGroup.refresh();
        thornCollider = this.physics.add.collider(player, thornGroup);
      }
      btn.setText(next ? '[parede: aberta]' : '[parede: fechada]');
    });

    createTransitionLine(this, 0, groundTop / 2, 1, groundTop, player, 'forest-swamp-room-door-1');

    PlayerCamera.setup(this, player, mapWidth);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this, 'swamp');

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.removeAllListeners();
      this.input.keyboard?.removeAllListeners();
    });
  }

  update(): void {
    this.playerService.update();
  }
}
