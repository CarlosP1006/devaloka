import { LPC } from '@objects/player/utils/PlayerAnimations';

export function loadPlayerAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: 'idle',
    frames: scene.anims.generateFrameNumbers('player', { frames: LPC.idle_right }),
    frameRate: 2,
    repeat: -1,
  });

  scene.anims.create({
    key: 'walk',
    frames: scene.anims.generateFrameNumbers('player', { frames: LPC.walk_right }),
    frameRate: 9,
    repeat: -1,
  });

  scene.anims.create({
    key: 'run',
    frames: scene.anims.generateFrameNumbers('player', { frames: LPC.run_right }),
    frameRate: 12,
    repeat: -1,
  });

  scene.anims.create({
    key: 'jump',
    frames: scene.anims.generateFrameNumbers('player', { frames: LPC.jump_right }),
    frameRate: 8,
    repeat: 0,
  });

  scene.anims.create({
    key: 'attack',
    frames: scene.anims.generateFrameNumbers('player-sword-big', { start: 306, end: 311 }),
    frameRate: 30,
    repeat: 0,
  });
}
