import { PlayerObject } from '@objects/player/controller/PlayerObject';

export class PlayerService {
  private player!: PlayerObject;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  init(player: PlayerObject, scene: Phaser.Scene): void {
    this.player = player;
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
  }
}
