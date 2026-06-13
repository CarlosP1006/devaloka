const COLS = 13;

const row = (r: number) => r * COLS;

export const LPC = {
  // spellcast — lançar magia (7 frames por direção)
  spellcast_up: Array.from({ length: 7 }, (_, i) => row(0) + i),
  spellcast_left: Array.from({ length: 7 }, (_, i) => row(1) + i),
  spellcast_down: Array.from({ length: 7 }, (_, i) => row(2) + i),
  spellcast_right: Array.from({ length: 7 }, (_, i) => row(3) + i),

  // thrust — ataque frontal (8 frames por direção)
  thrust_up: Array.from({ length: 8 }, (_, i) => row(4) + i),
  thrust_left: Array.from({ length: 8 }, (_, i) => row(5) + i),
  thrust_down: Array.from({ length: 8 }, (_, i) => row(6) + i),
  thrust_right: Array.from({ length: 8 }, (_, i) => row(7) + i),

  // walk — andar (9 frames por direção)
  walk_up: Array.from({ length: 9 }, (_, i) => row(8) + i),
  walk_left: Array.from({ length: 9 }, (_, i) => row(9) + i),
  walk_down: Array.from({ length: 9 }, (_, i) => row(10) + i),
  walk_right: Array.from({ length: 9 }, (_, i) => row(11) + i),

  // slash — ataque horizontal (6 frames por direção)
  slash_up: Array.from({ length: 6 }, (_, i) => row(12) + i),
  slash_left: Array.from({ length: 6 }, (_, i) => row(13) + i),
  slash_down: Array.from({ length: 6 }, (_, i) => row(14) + i),
  slash_right: Array.from({ length: 6 }, (_, i) => row(15) + i),

  // shoot — atirar com arco (13 frames por direção)
  shoot_up: Array.from({ length: 13 }, (_, i) => row(16) + i),
  shoot_left: Array.from({ length: 13 }, (_, i) => row(17) + i),
  shoot_down: Array.from({ length: 13 }, (_, i) => row(18) + i),
  shoot_right: Array.from({ length: 13 }, (_, i) => row(19) + i),

  // hurt — tomar dano (6 frames, 1 direção)
  hurt: Array.from({ length: 6 }, (_, i) => row(20) + i),

  // climb — escalar (6 frames, 1 direção)
  climb: Array.from({ length: 6 }, (_, i) => row(21) + i),

  // idle — parado (2 frames por direção)
  idle_up: Array.from({ length: 2 }, (_, i) => row(22) + i),
  idle_left: Array.from({ length: 2 }, (_, i) => row(23) + i),
  idle_down: Array.from({ length: 2 }, (_, i) => row(24) + i),
  idle_right: Array.from({ length: 2 }, (_, i) => row(25) + i),

  // jump — pular/cair (5 frames por direção — LPC v3 = 5)
  jump_up: Array.from({ length: 5 }, (_, i) => row(26) + i),
  jump_left: Array.from({ length: 5 }, (_, i) => row(27) + i),
  jump_down: Array.from({ length: 5 }, (_, i) => row(28) + i),
  jump_right: Array.from({ length: 5 }, (_, i) => row(29) + i),

  // sit — sentar (3 frames por direção)
  sit_up: Array.from({ length: 3 }, (_, i) => row(30) + i),
  sit_left: Array.from({ length: 3 }, (_, i) => row(31) + i),
  sit_down: Array.from({ length: 3 }, (_, i) => row(32) + i),
  sit_right: Array.from({ length: 3 }, (_, i) => row(33) + i),

  // emote — gesto/emoção (3 frames por direção)
  emote_up: Array.from({ length: 3 }, (_, i) => row(34) + i),
  emote_left: Array.from({ length: 3 }, (_, i) => row(35) + i),
  emote_down: Array.from({ length: 3 }, (_, i) => row(36) + i),
  emote_right: Array.from({ length: 3 }, (_, i) => row(37) + i),

  // run — correr (8 frames por direção)
  run_up: Array.from({ length: 8 }, (_, i) => row(38) + i),
  run_left: Array.from({ length: 8 }, (_, i) => row(39) + i),
  run_down: Array.from({ length: 8 }, (_, i) => row(40) + i),
  run_right: Array.from({ length: 8 }, (_, i) => row(41) + i),

  // combat_idle — parado em combate (2 frames por direção)
  combat_idle_up: Array.from({ length: 2 }, (_, i) => row(42) + i),
  combat_idle_left: Array.from({ length: 2 }, (_, i) => row(43) + i),
  combat_idle_down: Array.from({ length: 2 }, (_, i) => row(44) + i),
  combat_idle_right: Array.from({ length: 2 }, (_, i) => row(45) + i),

  // ── ATAQUES 1 MÃO (corpo sem arma) ──

  // slash_1h — golpe diagonal (13 frames por direção)
  slash_1h_up: Array.from({ length: 13 }, (_, i) => row(46) + i),
  slash_1h_left: Array.from({ length: 13 }, (_, i) => row(47) + i),
  slash_1h_down: Array.from({ length: 13 }, (_, i) => row(48) + i),
  slash_1h_right: Array.from({ length: 13 }, (_, i) => row(49) + i),

  // halfslash_1h — meio golpe (6 frames por direção)
  halfslash_1h_up: Array.from({ length: 6 }, (_, i) => row(50) + i),
  halfslash_1h_left: Array.from({ length: 6 }, (_, i) => row(51) + i),
  halfslash_1h_down: Array.from({ length: 6 }, (_, i) => row(52) + i),
  halfslash_1h_right: Array.from({ length: 6 }, (_, i) => row(53) + i),
};
