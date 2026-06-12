export function DEV_PRINT_SAVE(): void {
  const config = localStorage.getItem('devaloka_config');
  const activeSlot = config ? JSON.parse(config).activeSlot : null;
  const key = activeSlot ?? 'devaloka_save_1';
  const raw = localStorage.getItem(key);
  console.log(`[${key}]`, raw ? JSON.parse(raw) : null);
}
