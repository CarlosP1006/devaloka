import { asClass, AwilixContainer } from 'awilix';
import { PlayerService } from '@services/PlayerService';

export function registerServices(container: AwilixContainer): void {
  container.register(
    'playerService',
    asClass(PlayerService, { lifetime: 'SINGLETON' }),
  );
}
