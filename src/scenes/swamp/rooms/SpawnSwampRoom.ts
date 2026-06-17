import { container } from '@containers/index';
import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { PlayerCamera } from '@objects/player/utils/PlayerCamera';
import { PlayerService } from '@objects/player/services/PlayerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { createGround } from '@utils/createGround';
import { createGroundChunk, getTileSize } from '@utils/createGroundChunk';
import { createTransitionLine } from '@utils/createTransitionLine';
import { Depth } from '@utils/Depth';

export class SpawnSwampRoom extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'SpawnSwampRoom' });
  }

  create(data: { spawnX?: number; spawnY?: number }): void {
    const mapWidth = 2560;
    const { groundTop, tileH } = getTileSize(this);
    const { group: groundGroup } = createGround(
      this,
      'swamp-ground',
      undefined,
    );

    this.add
      .image(mapWidth / 2, (groundTop + tileH) / 2, 'spawn-swamp-background')
      .setDisplaySize(mapWidth, groundTop + tileH)
      .setDepth(Depth.FAR_BACKGROUND)
      .setAlpha(0.6);

    const { group: chunk7 } = createGroundChunk(
      this,
      7,
      4,
      [0, 1, 2],
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk10 } = createGroundChunk(
      this,
      10,
      6,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk13 } = createGroundChunk(
      this,
      13,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk14 } = createGroundChunk(
      this,
      14,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk15 } = createGroundChunk(
      this,
      15,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk16 } = createGroundChunk(
      this,
      16,
      4,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk17 } = createGroundChunk(
      this,
      17,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    const { group: chunk18 } = createGroundChunk(
      this,
      18,
      8,
      undefined,
      'swamp-ground',
      'swamp-ground-dirt',
    );

    this.add
      .image(2057, groundTop - 186, 'swamp-tree-large')
      .setOrigin(0.5, 1)
      .setScale(0.82)
      .setDepth(Depth.BACKGROUND_2);

    this.add
      .image(450, groundTop + 50, 'swamp-tree-twisted')
      .setOrigin(0.5, 1)
      .setScale(0.65)
      .setDepth(Depth.BACKGROUND_1);

    this.add
      .image(120, groundTop + 155, 'swamp-stone-rune')
      .setOrigin(0.5, 1)
      .setScale(1.1)
      .setDepth(Depth.MAIN);

    const stoneRuneGroup = this.physics.add.staticGroup();
    const stoneBody = this.add.zone(120, groundTop + 36, 235, 450);
    stoneBody.setOrigin(0.5, 1);
    stoneRuneGroup.add(stoneBody);

    if (!this.anims.exists('owl-blink')) {
      this.anims.create({
        key: 'owl-blink',
        frames: [
          { key: 'swamp-owl', frame: 0, duration: 5000 },
          { key: 'swamp-owl', frame: 1, duration: 500 },
        ],
        repeat: -1,
      });
    }
    this.add
      .sprite(2210, groundTop - 298, 'swamp-owl')
      .setScale(0.15)
      .setDepth(Depth.MAIN)
      .play('owl-blink');

    this.sound.play('swamp-ambient', {
      loop: true,
      volume: 0.5,
    });

    const owlTimer = this.time.addEvent({
      delay: 15000,
      loop: true,
      callback: () => this.sound.play('swamp-owl-call', { volume: 0.1 }),
    });

    const saveManagerService =
      container.resolve<SaveManagerService>('saveManagerService');
    const save = saveManagerService.get();
    const savedHere = save?.location?.room === 'SpawnSwampRoom';
    const spawnX = data?.spawnX ?? (savedHere ? save.location?.x ?? 300 : 300);
    const savedY = savedHere
      ? save.location?.yTile !== undefined
        ? groundTop - save.location.yTile * tileH
        : save.location?.y ?? groundTop - 60
      : groundTop - 60;
    const spawnY = data?.spawnY ?? savedY;
    const player = PlayerObject.create(this, spawnX, spawnY);
    this.physics.add.collider(player, [
      groundGroup,
      stoneRuneGroup,
      chunk10,
      chunk13,
      chunk14,
      chunk15,
      chunk16,
      chunk17,
      chunk18,
      chunk7,
    ]);
    createTransitionLine(
      this,
      mapWidth,
      groundTop / 2,
      1,
      groundTop,
      player,
      'spawn-swamp-room-door-1',
    );

    PlayerCamera.setup(this, player, mapWidth);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this, 'swamp');
    this.playerService.registerSlingColliders([
      groundGroup,
      stoneRuneGroup,
      chunk7,
      chunk10,
      chunk13,
      chunk14,
      chunk15,
      chunk16,
      chunk17,
      chunk18,
    ]);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      owlTimer.remove();
      this.input.removeAllListeners();
      this.input.keyboard?.removeAllListeners();
    });
  }

  update(): void {
    this.playerService.update();
  }
}
