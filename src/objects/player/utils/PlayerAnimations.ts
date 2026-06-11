// LPC Spritesheet layout: 13 columns x 54 rows, 64x64 per frame
// Frame index = row * 13 + column
// Direction order per animation: row+0=up, row+1=left, row+2=down, row+3=right
// All frame counts confirmed visually from exported animation files

const COLS = 13;

const row = (r: number) => r * COLS;

export const LPC = {
  // ── STANDARD LPC (rows 0–20) ──────────────────────────────────────────────

  spellcast: {
    // rows 0–3 | 7 frames
    up: { start: row(0), end: row(0) + 6 },
    left: { start: row(1), end: row(1) + 6 },
    down: { start: row(2), end: row(2) + 6 },
    right: { start: row(3), end: row(3) + 6 },
  },
  thrust: {
    // rows 4–7 | 8 frames
    up: { start: row(4), end: row(4) + 7 },
    left: { start: row(5), end: row(5) + 7 },
    down: { start: row(6), end: row(6) + 7 },
    right: { start: row(7), end: row(7) + 7 },
  },
  walk: {
    // rows 8–11 | 9 frames
    up: { start: row(8), end: row(8) + 8 },
    left: { start: row(9), end: row(9) + 8 },
    down: { start: row(10), end: row(10) + 8 },
    right: { start: row(11), end: row(11) + 8 },
  },
  slash: {
    // rows 12–15 | 6 frames
    up: { start: row(12), end: row(12) + 5 },
    left: { start: row(13), end: row(13) + 5 },
    down: { start: row(14), end: row(14) + 5 },
    right: { start: row(15), end: row(15) + 5 },
  },
  shoot: {
    // rows 16–19 | 13 frames
    up: { start: row(16), end: row(16) + 12 },
    left: { start: row(17), end: row(17) + 12 },
    down: { start: row(18), end: row(18) + 12 },
    right: { start: row(19), end: row(19) + 12 },
  },
  hurt: {
    // row 20 | 6 frames | 1 direção (frente)
    down: { start: row(20), end: row(20) + 5 },
  },

  // ── EXTENDED LPC (rows 21+) ───────────────────────────────────────────────

  climb: {
    // row 21 | 6 frames | 1 direção
    side: { start: row(21), end: row(21) + 5 },
  },
  idle: {
    // rows 22–25 | 2 frames
    up: { start: row(22), end: row(22) + 1 },
    left: { start: row(23), end: row(23) + 1 },
    down: { start: row(24), end: row(24) + 1 },
    right: { start: row(25), end: row(25) + 1 },
  },
  jump: {
    // rows 26–29 | 4 frames
    up: { start: row(26), end: row(26) + 3 },
    left: { start: row(27), end: row(27) + 3 },
    down: { start: row(28), end: row(28) + 3 },
    right: { start: row(29), end: row(29) + 3 },
  },
  sit: {
    // rows 30–33 | 3 frames
    up: { start: row(30), end: row(30) + 2 },
    left: { start: row(31), end: row(31) + 2 },
    down: { start: row(32), end: row(32) + 2 },
    right: { start: row(33), end: row(33) + 2 },
  },
  emote: {
    // rows 34–37 | 3 frames
    up: { start: row(34), end: row(34) + 2 },
    left: { start: row(35), end: row(35) + 2 },
    down: { start: row(36), end: row(36) + 2 },
    right: { start: row(37), end: row(37) + 2 },
  },
  run: {
    // rows 38–41 | 8 frames
    up: { start: row(38), end: row(38) + 7 },
    left: { start: row(39), end: row(39) + 7 },
    down: { start: row(40), end: row(40) + 7 },
    right: { start: row(41), end: row(41) + 7 },
  },
  combat_idle: {
    // rows 42–45 | 2 frames
    up: { start: row(42), end: row(42) + 1 },
    left: { start: row(43), end: row(43) + 1 },
    down: { start: row(44), end: row(44) + 1 },
    right: { start: row(45), end: row(45) + 1 },
  },
  watering: {
    // rows 46–49 | 7 frames
    up: { start: row(46), end: row(46) + 6 },
    left: { start: row(47), end: row(47) + 6 },
    down: { start: row(48), end: row(48) + 6 },
    right: { start: row(49), end: row(49) + 6 },
  },
  slash_1h: {
    // rows 50–53 | 13 frames
    up: { start: row(50), end: row(50) + 12 },
    left: { start: row(51), end: row(51) + 12 },
    down: { start: row(52), end: row(52) + 12 },
    right: { start: row(53), end: row(53) + 12 },
  },
  // backslash_1h e halfslash_1h não estão no spritesheet atual (sem arma equipada)
};
