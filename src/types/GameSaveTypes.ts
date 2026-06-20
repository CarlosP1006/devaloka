import { PlayerLocationTypes } from './gameTypes/PlayerLocationTypes';
import { SlotInfoTypes } from './gameTypes/SlotInfoTypes';
import { WeaponTypes } from './gameTypes/WeaponTypes';
import { SceneModTypes } from './gameTypes/SceneModTypes';

export type GameSaveTypes = {
  location?: PlayerLocationTypes;
  slotInfo?: SlotInfoTypes;
  weapons?: WeaponTypes;
  sceneMods?: SceneModTypes;
  loreShown?: boolean;
};
