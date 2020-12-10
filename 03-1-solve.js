// Prepare
const { readFileSync } = require("fs");
const lines = readFileSync("03-1-input.txt", "utf-8")
  .trim()
  .split(/[\r\n]+/)
  .map((line) => [...line].map((c) => (c === "#" ? 1 : 0)));

const rows = lines.length;
const cols = lines[0].length;

const solve1 = () =>
  lines.reduce(
    (nb, line, i) =>
      // down i, right 3 * i
      nb + line[(3 * i) % cols],
    0
  );

require("./helper")(solve1);
