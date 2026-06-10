import { container } from '@containers/index';
import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { PlayerCamera } from '@objects/player/utils/PlayerCamera';
import { PlayerService } from '@objects/player/services/PlayerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { createGround } from '@utils/createGround';
import { createGroundChunk, TILE_H } from '@utils/createGroundChunk';
import { Depth } from '@utils/Depth';
import { SoundVolume } from '@utils/SoundVolume';

export class SpawnSwampRoom extends Phaser.Scene {
  private playerService!: PlayerService;

  constructor() {
    super({ key: 'SpawnSwampRoom' });
  }

  preload(): void {}

  create(): void {
    const mapWidth = 2560;
    const { group: groundGroup } = createGround(
      this,
      'swamp-ground',
      undefined,
    );

    const groundTop = this.scale.height - TILE_H;
    this.add
      .image(mapWidth / 2, this.scale.height / 2, 'swamp-background')
      .setDisplaySize(mapWidth, this.scale.height)
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

    const { group: chunk9 } = createGroundChunk(
      this,
      9,
      7,
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
      .image(2057, groundTop - 156, 'swamp-tree-large')
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
    const stoneBody = this.add.rectangle(120, groundTop + 36, 235, 450, 0, 0);
    stoneBody.setOrigin(0.5, 1);
    stoneRuneGroup.add(stoneBody);

    this.anims.create({
      key: 'owl-blink',
      frames: [
        { key: 'swamp-owl', frame: 0, duration: 5000 },
        { key: 'swamp-owl', frame: 1, duration: 500 },
      ],
      repeat: -1,
    });
    this.add
      .sprite(2210, groundTop - 268, 'swamp-owl')
      .setScale(0.15)
      .setDepth(Depth.MAIN)
      .play('owl-blink');

    this.sound.play('swamp-ambient', {
      loop: true,
      volume: SoundVolume.AMBIENT,
    });

    this.time.addEvent({
      delay: 15000,
      loop: true,
      callback: () => this.sound.play('swamp-owl-call', { volume: 0.1 }),
    });

    const saveManagerService =
      container.resolve<SaveManagerService>('saveManagerService');
    const save = saveManagerService.get();
    const spawnX =
      save?.location?.room === 'SpawnSwampRoom' ? save.location.x : 300;
    const spawnY =
      save?.location?.room === 'SpawnSwampRoom'
        ? save.location.y
        : groundTop - 60;
    const player = PlayerObject.create(this, spawnX, spawnY);
    this.physics.add.collider(player, [
      groundGroup,
      stoneRuneGroup,
      chunk9,
      chunk14,
      chunk15,
      chunk16,
      chunk17,
      chunk18,
      chunk7,
    ]);
    PlayerCamera.setup(this, player, mapWidth);
    this.playerService = container.resolve<PlayerService>('playerService');
    this.playerService.init(player, this, 'swamp');
  }

  update(): void {
    this.playerService.update();
  }
}
