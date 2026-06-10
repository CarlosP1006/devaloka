import { GameSaveTypes } from '../types/GameSaveTypes';

const SAVE_KEY = 'devaloka_save';

export class SaveManagerService {
  private current: GameSaveTypes | null = null;

  constructor() {
    this.current = this.load();
  }

  load(): GameSaveTypes | null {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GameSaveTypes;
    } catch {
      return null;
    }
  }

  save(patch: Partial<GameSaveTypes>): void {
    this.current = { ...(this.current ?? ({} as GameSaveTypes)), ...patch };
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.current));
  }

  clear(): void {
    this.current = null;
    localStorage.removeItem(SAVE_KEY);
  }

  get(): GameSaveTypes | null {
    return this.current;
  }
}
