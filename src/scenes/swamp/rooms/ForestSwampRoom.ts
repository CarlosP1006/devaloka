import { container } from '@containers/index';
import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { PlayerCamera } from '@objects/player/utils/PlayerCamera';
import { PlayerService } from '@objects/player/services/PlayerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { createGround } from '@utils/createGround';
import { createCeiling } from '@utils/createCeiling';
import { createTransitionLine } from '@utils/createTransitionLine';
import { createGroundChunk, getTileSize } from '@utils/createGroundChunk';
import { Depth } from '@utils/Depth';
import { showNewItem } from '@utils/showNewItem';

const mapWidth = 2560;

export class ForestSwampRoom extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'ForestSwampRoom' });
  }

  create(data: { spawnX?: number; spawnY?: number }): void {
    const { tileH, groundTop } = getTileSize(this);

    this.add
      .image(mapWidth / 2, (groundTop + tileH) / 2 + 53, 'forest-swamp-background')
      .setDisplaySize(mapWidth, groundTop + tileH)
      .setDepth(Depth.FAR_BACKGROUND)
      .setAlpha(0.85);

    const { group: groundGroup } = createGround(
      this,
      'swamp-ground',
      undefined,
    );

    const saveManagerService =
      container.resolve<SaveManagerService>('saveManagerService');
    const save = saveManagerService.get();

    const savedHere = save?.location?.room === 'ForestSwampRoom';
    const spawnX = data?.spawnX ?? (savedHere ? save.location?.x ?? 300 : 300);
    const savedY = savedHere
      ? save.location?.yTile !== undefined
        ? groundTop - save.location.yTile * tileH
        : save.location?.y ?? groundTop - 60
      : groundTop - 60;
    const spawnY = data?.spawnY ?? savedY;

    const { group: chunk0 } = createGroundChunk(
      this,
      0,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );
    const { group: chunk1 } = createGroundChunk(
      this,
      1,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );
    const { group: chunk2 } = createGroundChunk(
      this,
      2,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );
    const { group: chunk3 } = createGroundChunk(
      this,
      3,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );
    const { group: chunk4 } = createGroundChunk(
      this,
      4,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );
    const { group: ceilingGroup } = createCeiling(this, 'forest-swamp-ceiling');

    const thornDoorOpen =
      save?.sceneMods?.swamp?.forestRoom?.thornDoorOpen ?? false;
    let thornGroup: Phaser.Physics.Arcade.StaticGroup | null = null;
    let thornImages: Phaser.GameObjects.Image[] = [];
    let thornCollider: Phaser.Physics.Arcade.Collider | null = null;

    if (!thornDoorOpen) {
      const thorn = createGroundChunk(
        this,
        2,
        12,
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        'forest-swamp-ground-surface',
        'forest-swamp-ground-thorns',
      );
      thornGroup = thorn.group;
      thornImages = thorn.images;
    }

    const player = PlayerObject.create(this, spawnX, spawnY);
    this.physics.add.collider(player, [
      groundGroup,
      chunk0,
      chunk1,
      chunk2,
      chunk3,
      chunk4,
      ceilingGroup,
    ]);
    if (thornGroup)
      thornCollider = this.physics.add.collider(player, thornGroup);

    const chestSwordTaken =
      save?.sceneMods?.swamp?.forestRoom?.chestSwordTaken ?? false;
    const chestX = 150;
    const chestY = groundTop - 8 * tileH;
    const chestOpenY = chestY + 1;
    const chestImg = this.add
      .image(
        chestX,
        chestSwordTaken ? chestOpenY : chestY,
        chestSwordTaken ? 'chest-swamp-open' : 'chest-swamp-closed',
      )
      .setOrigin(0.5, 1)
      .setScale(0.28)
      .setDepth(Depth.MAIN);

    if (!chestSwordTaken) {
      chestImg.setInteractive({ useHandCursor: true });
      chestImg.on('pointerover', () => {
        chestImg.postFX.addGlow(0xffffff, 2, 0);
      });
      chestImg.on('pointerout', () => {
        chestImg.postFX.clear();
      });
      chestImg.on('pointerdown', () => {
        chestImg.postFX.clear();
        showNewItem(this, {
          itemKey: 'sword-icon',
          itemScaleX: 0.2,
          itemScaleY: 0.2,
          description:
            'Você encontrou a Cimitarra Protetora! Ataque com o botão esquerdo e invoque um escudo mágico com o direito.',
          onClose: () => {
            saveManagerService.save({
              sceneMods: {
                swamp: {
                  forestRoom: { chestSwordTaken: true, thornDoorOpen: true },
                },
              },
              weapons: {
                sword: { unlocked: true },
                shield: { unlocked: true },
              },
            });
            chestImg.setTexture('chest-swamp-open');
            chestImg.setY(chestOpenY);
            chestImg.disableInteractive();
            if (thornCollider) {
              thornCollider.destroy();
              thornCollider = null;
            }
            thornImages.forEach(img => img.destroy());
            thornGroup?.destroy(true);
            thornGroup = null;
            thornImages = [];
          },
        });
      });
    }

    createTransitionLine(
      this,
      0,
      groundTop / 2,
      1,
      groundTop,
      player,
      'forest-swamp-room-door-1',
    );

    this.sound.play('forest-swamp-ambient', { loop: true, volume: 0.5 });

    PlayerCamera.setup(this, player, mapWidth);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this, 'swamp');
    const slingTargets: Phaser.Physics.Arcade.StaticGroup[] = [
      groundGroup,
      chunk0,
      chunk1,
      chunk2,
      chunk3,
      chunk4,
      ceilingGroup,
    ];
    if (thornGroup) slingTargets.push(thornGroup);
    this.playerService.registerSlingColliders(slingTargets);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.removeAllListeners();
      this.input.keyboard?.removeAllListeners();
    });
  }

  update(): void {
    this.playerService.update();
  }
}
