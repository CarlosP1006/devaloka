import { PlayerObject } from '@objects/player/controller/PlayerObject';
import { SoundVolume } from '@utils/SoundVolume';
import { SaveManager } from '@services/SaveManager';

const STEP_INTERVAL = 80;
const SAVE_INTERVAL = 3000;

export class PlayerService {
  private player!: PlayerObject;
  private scene!: Phaser.Scene;
  private biome = '';
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private lastX = 0;
  private stepDistance = 0;
  private saveManager: SaveManager;

  constructor(saveManager: SaveManager) {
    this.saveManager = saveManager;
  }

  init(player: PlayerObject, scene: Phaser.Scene, biome = ''): void {
    this.player = player;
    this.scene = scene;
    this.biome = biome;
    this.lastX = player.x;

    scene.time.addEvent({
      delay: SAVE_INTERVAL,
      loop: true,
      callback: () => {
        if (!this.player.body!.blocked.down) return;
        this.saveManager.save({
          location: {
            room: scene.scene.key,
            x: Math.round(this.player.x),
            y: Math.round(this.player.y),
          },
        });
      },
    });
    this.keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.shiftKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
    );
    this.spaceKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
  }

  update(): void {
    const running = this.shiftKey.isDown;
    const onGround = this.player.body!.blocked.down;

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && onGround) {
      this.player.jump();
      this.scene.sound.play('player-jump', { volume: 0.35 });
    }

    if (this.keyA.isDown) {
      if (running) this.player.runLeft();
      else this.player.moveLeft();
    } else if (this.keyD.isDown) {
      if (running) this.player.runRight();
      else this.player.moveRight();
    } else if (onGround) {
      this.player.idle();
    }

    const currentX = this.player.x;
    const moved = Math.abs(currentX - this.lastX);
    this.lastX = currentX;

    if (this.biome && onGround && (this.keyA.isDown || this.keyD.isDown)) {
      this.stepDistance += moved;
      if (this.stepDistance >= STEP_INTERVAL) {
        this.stepDistance = 0;
        this.scene.sound.play(`${this.biome}-step`, {
          volume: SoundVolume.PLAYER,
        });
      }
    } else {
      this.stepDistance = 0;
    }
  }
}
