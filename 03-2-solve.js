// Prepare
const { readFileSync } = require("fs");
const lines = readFileSync("03-1-input.txt", "utf-8")
  .trim()
  .split(/[\r\n]+/)
  .map((line) => [...line].map((c) => (c === "#" ? 1 : 0)));

const rows = lines.length;
const cols = lines[0].length;

const solve1 = () =>
  [[1], [3], [5], [7], [1, 2]].reduce(
    (n, [right, down = 1]) =>
      n *
      lines.reduce(
        (nb, line, i) => nb + (i % down === 0 ? line[(right * i) % cols] : 0),
        0
      ),
    1
  );

require("./helper")(solve1);
