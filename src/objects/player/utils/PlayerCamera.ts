import { LOGICAL_HEIGHT } from '@utils/createGroundChunk';

export class PlayerCamera {
  static setup(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    mapWidth: number,
  ): void {
    scene.cameras.main.setZoom(scene.scale.height / LOGICAL_HEIGHT);
    scene.physics.world.setBounds(0, 0, mapWidth, LOGICAL_HEIGHT);
    scene.cameras.main.setBounds(0, 0, mapWidth, LOGICAL_HEIGHT);
    scene.cameras.main.startFollow(target, false, 1, 1);
  }
}
