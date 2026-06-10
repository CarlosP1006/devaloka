import { asClass, AwilixContainer } from 'awilix';
import { PlayerService } from '@objects/player/services/PlayerService';
import { AudioManagerService } from '@services/AudioManagerService';
import { SaveManagerService } from '@services/SaveManagerService';
import { ConfigPanelService } from '@services/ConfigPanelService';
import { GameInputService } from '@services/GameInputService';

export function registerServices(container: AwilixContainer): void {
  container.register(
    'playerService',
    asClass(PlayerService, { lifetime: 'SINGLETON' }),
  );
  container.register(
    'audioManagerService',
    asClass(AudioManagerService, { lifetime: 'SINGLETON' }),
  );
  container.register(
    'saveManagerService',
    asClass(SaveManagerService, { lifetime: 'SINGLETON' }),
  );
  container.register(
    'configPanelService',
    asClass(ConfigPanelService, { lifetime: 'SINGLETON' }),
  );
  container.register(
    'gameInputService',
    asClass(GameInputService, { lifetime: 'SINGLETON' }),
  );
}
