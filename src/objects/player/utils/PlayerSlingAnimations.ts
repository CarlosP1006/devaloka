const COLS = 13;

const row = (r: number) => r * COLS;

export const LPC_SLING = {
  // ── ANIMAÇÕES COM ESTILINGUE (slingshot) ──
  // sheet player-sling.png: 832x3456 (13 colunas x 54 linhas).
  // o estilingue só aparece composto em walk, shoot e hurt.

  // walk — andar com estilingue (9 frames por direção)
  walk_up: Array.from({ length: 9 }, (_, i) => row(8) + i),
  walk_left: Array.from({ length: 9 }, (_, i) => row(9) + i),
  walk_down: Array.from({ length: 9 }, (_, i) => row(10) + i),
  walk_right: Array.from({ length: 9 }, (_, i) => row(11) + i),

  // shoot — atirar com estilingue (13 frames por direção)
  shoot_up: Array.from({ length: 13 }, (_, i) => row(16) + i),
  shoot_left: Array.from({ length: 13 }, (_, i) => row(17) + i),
  shoot_down: Array.from({ length: 13 }, (_, i) => row(18) + i),
  shoot_right: Array.from({ length: 13 }, (_, i) => row(19) + i),

  // hurt — tomar dano com estilingue (6 frames, 1 direção)
  hurt: Array.from({ length: 6 }, (_, i) => row(20) + i),
};
