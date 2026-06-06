import { asClass, AwilixContainer } from 'awilix';
import { PlayerService } from '@objects/player/services/PlayerService';

export function registerServices(container: AwilixContainer): void {
  container.register(
    'playerService',
    asClass(PlayerService, { lifetime: 'SINGLETON' }),
  );
}
