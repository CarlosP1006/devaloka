import { GlobalSaveTypes } from '../types/GlobalSaveTypes';

const GLOBAL_SAVE_KEY = 'devaloka_config';

export class GlobalSaveService {
  private current: GlobalSaveTypes | null = null;

  constructor() {
    this.current = this.load();
  }

  load(): GlobalSaveTypes | null {
    const raw = localStorage.getItem(GLOBAL_SAVE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GlobalSaveTypes;
    } catch {
      return null;
    }
  }

  save(patch: Partial<GlobalSaveTypes>): void {
    this.current = { ...(this.current ?? ({} as GlobalSaveTypes)), ...patch };
    localStorage.setItem(GLOBAL_SAVE_KEY, JSON.stringify(this.current));
  }

  get(): GlobalSaveTypes | null {
    return this.current;
  }
}
