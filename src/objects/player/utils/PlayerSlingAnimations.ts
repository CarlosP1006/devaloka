const COLS = 13;
const row = (r: number) => r * COLS;

export const LPC_SLING = {
  shoot_left: {
    aim: [
      row(1) + 0,
      row(1) + 1,
      row(1) + 2,
      row(1) + 3,
      row(1) + 4,
      row(1) + 5,
      row(1) + 6,
      row(1) + 7,
    ],
    release: [row(1) + 8, row(1) + 9, row(1) + 10, row(1) + 11, row(1) + 12],
  },
  shoot_right: {
    aim: [
      row(3) + 0,
      row(3) + 1,
      row(3) + 2,
      row(3) + 3,
      row(3) + 4,
      row(3) + 5,
      row(3) + 6,
      row(3) + 7,
    ],
    release: [row(3) + 8, row(3) + 9, row(3) + 10, row(3) + 11, row(3) + 12],
  },
};
