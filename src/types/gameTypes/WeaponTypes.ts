import { SwordTypes } from './SwordTypes';
import { SlingTypes } from './SlingTypes';
import { ShieldTypes } from './ShieldTypes';

export type WeaponTypes = {
  sword?: SwordTypes;
  shield?: ShieldTypes;
  sling?: SlingTypes;
};
