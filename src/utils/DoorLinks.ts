interface DoorLink {
  loader: string;
  targetRoom: string;
  spawnX: number;
  spawnY: number;
}

export const DOOR_LINKS: Record<string, DoorLink> = {
  'spawn-swamp-room-door-1': {
    loader: 'SwampLoaderScene',
    targetRoom: 'ForestSwampRoom',
    spawnX: 47,
    spawnY: 166,
  },
  'forest-swamp-room-door-1': {
    loader: 'SwampLoaderScene',
    targetRoom: 'SpawnSwampRoom',
    spawnX: 2514,
    spawnY: 166,
  },
};
