const COLS = 18;

const row = (r: number) => r * COLS;

// frames oversize 128x128 (bloco 2x2 no grid 64px) — passo 2 nas colunas;
// retorna o índice da célula superior-esquerda de cada frame.
// a animação ocupa 2 linhas (r e r+1); a textura precisa ser fatiada em
// 128x128 para esses frames, não em 64x64.
const big = (r: number, count: number) =>
  Array.from({ length: count }, (_, i) => row(r) + i * 2);

export const LPC_SWORD = {
  // ── ATAQUES COM ESPADA (scimitar) — oversize 128x128 ──
  // sheet player-sword.png: 1152x4480 (18 colunas x 70 linhas).
  // linhas 0-53 são idênticas ao player base (SEM espada).
  // a espada só aparece nas animações oversize abaixo (linhas 54-69).

  // slash_1h — golpe com espada (9 frames por direção, 2 linhas cada)
  slash_1h_up: big(54, 9),
  slash_1h_left: big(56, 9),
  slash_1h_down: big(58, 9),
  slash_1h_right: big(60, 9),

  // backslash_1h — golpe de revés com espada (6 frames por direção, 2 linhas cada)
  backslash_1h_up: big(62, 6),
  backslash_1h_left: big(64, 6),
  backslash_1h_down: big(66, 6),
  backslash_1h_right: big(68, 6),
};
