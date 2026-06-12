import { DOOR_LINKS } from '@utils/DoorLinks';

export function createTransitionLine(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  player: Phaser.Physics.Arcade.Sprite,
  doorTag: string,
): void {
  const link = DOOR_LINKS[doorTag];
  if (!link) return;

  const zone = scene.add.zone(x, y, width, height);
  scene.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);

  let triggered = false;
  scene.physics.add.overlap(player, zone, () => {
    if (triggered) return;
    triggered = true;
    scene.sound.stopAll();
    scene.scene.start(link.loader, {
      targetRoom: link.targetRoom,
      spawnX: link.spawnX,
      spawnY: link.spawnY,
    });
  });
}
