import { PlayerLocationTypes } from './subTypes/PlayerLocationTypes';
import { ConfigTypes } from './subTypes/ConfigTypes';

export type GameSaveTypes = {
  location: PlayerLocationTypes;
  config: ConfigTypes;
};
