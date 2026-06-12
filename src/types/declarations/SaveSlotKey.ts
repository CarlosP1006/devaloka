export const SLOT_KEYS = [
  'devaloka_save_1',
  'devaloka_save_2',
  'devaloka_save_3',
] as const;

export type SaveSlotKey = (typeof SLOT_KEYS)[number];
