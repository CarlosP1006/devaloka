export class PlayerCamera {
  static setup(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    mapWidth: number,
  ): void {
    scene.physics.world.setBounds(0, 0, mapWidth, scene.scale.height);
    scene.cameras.main.setBounds(0, 0, mapWidth, scene.scale.height);
    scene.cameras.main.startFollow(target);
  }
}
