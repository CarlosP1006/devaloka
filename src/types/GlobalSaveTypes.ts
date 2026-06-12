import { ConfigTypes } from './globalTypes/ConfigTypes';
import { SaveSlotKey } from './declarations/SaveSlotKey';

export type GlobalSaveTypes = {
  config: ConfigTypes;
  activeSlot: SaveSlotKey | null;
};
