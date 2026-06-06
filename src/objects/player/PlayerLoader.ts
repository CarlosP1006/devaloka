import { LPC } from './utils/PlayerAnimations';

export function loadPlayerAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: 'idle',
    frames: scene.anims.generateFrameNumbers('player', LPC.idle.right),
    frameRate: 2,
    repeat: -1,
  });

  scene.anims.create({
    key: 'walk',
    frames: scene.anims.generateFrameNumbers('player', LPC.walk.right),
    frameRate: 9,
    repeat: -1,
  });

  scene.anims.create({
    key: 'run',
    frames: scene.anims.generateFrameNumbers('player', LPC.run.right),
    frameRate: 12,
    repeat: -1,
  });

  scene.anims.create({
    key: 'jump',
    frames: scene.anims.generateFrameNumbers('player', LPC.jump.right),
    frameRate: 8,
    repeat: 0,
  });
}
