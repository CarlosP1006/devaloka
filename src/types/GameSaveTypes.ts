import { PlayerLocationTypes } from './gameTypes/PlayerLocationTypes';
import { SlotInfoTypes } from './gameTypes/SlotInfoTypes';

export type GameSaveTypes = {
  location?: PlayerLocationTypes;
  slotInfo?: SlotInfoTypes;
};
