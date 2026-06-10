import { asClass, AwilixContainer } from 'awilix';
import { PlayerService } from '@objects/player/services/PlayerService';
import { AudioManager } from '@services/AudioManager';
import { SaveManager } from '@services/SaveManager';

export function registerServices(container: AwilixContainer): void {
  container.register(
    'playerService',
    asClass(PlayerService, { lifetime: 'SINGLETON' }),
  );
  container.register(
    'audioManager',
    asClass(AudioManager, { lifetime: 'SINGLETON' }),
  );
  container.register(
    'saveManager',
    asClass(SaveManager, { lifetime: 'SINGLETON' }),
  );
}
