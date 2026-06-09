import { asClass, AwilixContainer } from 'awilix';
import { PlayerService } from '@objects/player/services/PlayerService';
import { AudioManager } from '@services/AudioManager';

export function registerServices(container: AwilixContainer): void {
  container.register(
    'playerService',
    asClass(PlayerService, { lifetime: 'SINGLETON' }),
  );
  container.register(
    'audioManager',
    asClass(AudioManager, { lifetime: 'SINGLETON' }),
  );
}
