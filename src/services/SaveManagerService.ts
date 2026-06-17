import { GameSaveTypes } from '../types/GameSaveTypes';
import { SaveSlotKey } from '../types/declarations/SaveSlotKey';
import { GlobalSaveService } from '@services/GlobalSaveService';

function deepMerge<T extends object>(base: T, patch: Partial<T>): T {
  const result = { ...base } as T;
  (Object.keys(patch) as Array<keyof T>).forEach(k => {
    const pv = patch[k];
    const bv = base[k];
    if (
      pv !== null &&
      pv !== undefined &&
      typeof pv === 'object' &&
      !Array.isArray(pv) &&
      bv !== null &&
      bv !== undefined &&
      typeof bv === 'object' &&
      !Array.isArray(bv)
    ) {
      (result as any)[k] = deepMerge(bv as object, pv as object);
    } else if (pv !== undefined) {
      (result as any)[k] = pv;
    }
  });
  return result;
}

export class SaveManagerService {
  private globalSaveService: GlobalSaveService;
  private current: GameSaveTypes | null = null;

  constructor(globalSaveService: GlobalSaveService) {
    this.globalSaveService = globalSaveService;
    this.current = this.load();
  }

  private getKey(): SaveSlotKey | null {
    return this.globalSaveService.get()?.activeSlot ?? null;
  }

  load(): GameSaveTypes | null {
    const key = this.getKey();
    if (!key) return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GameSaveTypes;
    } catch {
      return null;
    }
  }

  loadSlot(key: SaveSlotKey): GameSaveTypes | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GameSaveTypes;
    } catch {
      return null;
    }
  }

  reloadActiveSlot(): void {
    this.current = this.load();
  }

  save(patch: Partial<GameSaveTypes>): void {
    const key = this.getKey();
    if (!key) return;
    this.current = deepMerge(this.current ?? ({} as GameSaveTypes), patch);
    localStorage.setItem(key, JSON.stringify(this.current));
  }

  clear(): void {
    const key = this.getKey();
    if (!key) return;
    this.current = null;
    localStorage.removeItem(key);
  }

  clearSlot(key: SaveSlotKey): void {
    localStorage.removeItem(key);
    if (this.getKey() === key) this.current = null;
  }

  get(): GameSaveTypes | null {
    return this.current;
  }
}
