// Prepare
const { readFileSync } = require("fs");
const passes = readFileSync("05-1-input.txt", "utf-8")
  .trim()
  .split(/[\r\n]+/);

/* start from highest and go back (or not) depending on letter
FBFBBFFRLR
F → 127 - 1 * 2**6 → 63
B → 63 - 0 * 2**5 → 63
F → 63 - 1 * 2**4 → 47
B → 47 - 0 * 2**3 → 47
B → 47 - 0 * 2**2 → 47
F → 47 - 1 * 2**1 → 45
F → 45 - 1 * 2**0 → 44

FFFFFFF
F → 127 - 64 = 63
F → 63 - 32 = 31
F → 31 - 16 = 15
F → 15 - 8 = 7
F → 7 - 4 = 3
F → 3 - 2 = 1
F → 1 - 1 = 0

BBBBBBB → 127

etc. */
const computeSeatId = (pass) => {
  let row = 127;
  for (let i = 0; i < 7; i++) {
    if (pass[i] === "F") row -= 2 ** (6 - i);
  }
  let col = 7;
  for (let i = 0; i < 3; i++) {
    if (pass[7 + i] === "L") col -= 2 ** (2 - i);
  }
  return { col, row, id: row * 8 + col };
};

// Looking for the highest seat id:
// F means lower than B, R will give something greater than L
// replace F with A (lower than B) and it will work by just sorting alphabetically
const solve = () => {
  const sorted = passes.map((p) => p.replace(/F/g, "A")).sort();
  const pass = sorted[sorted.length - 1].replace(/A/g, "F");
  return { pass, seatId: computeSeatId(pass) };
};

require("./helper")(solve);
