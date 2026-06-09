export class AudioManager {
  private soundManager!: Phaser.Sound.BaseSoundManager;

  init(scene: Phaser.Scene): void {
    this.soundManager = scene.sound;
    this.soundManager.volume = 0.5;
  }

  setVolume(value: number): void {
    this.soundManager.volume = value;
  }

  mute(): void {
    this.soundManager.mute = true;
  }

  unmute(): void {
    this.soundManager.mute = false;
  }

  isMuted(): boolean {
    return this.soundManager.mute;
  }
}
