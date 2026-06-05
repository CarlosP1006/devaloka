import { Player } from '@objects/player/Player';

export class PlayerService {
  private player!: Player;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private shiftKey!: Phaser.Input.Keyboard.Key;

  init(player: Player, scene: Phaser.Scene): void {
    this.player = player;
    this.keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.shiftKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
    );
  }

  update(): void {
    const running = this.shiftKey.isDown;

    if (this.keyA.isDown) {
      if (running) this.player.runLeft();
      else this.player.moveLeft();
    } else if (this.keyD.isDown) {
      if (running) this.player.runRight();
      else this.player.moveRight();
    } else {
      this.player.idle();
    }
  }
}
