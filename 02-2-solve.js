// Prepare
const { readFileSync } = require("fs");
const inputs = readFileSync("02-1-input.txt", "utf-8")
  .trim()
  .split(/[\r\n]+/)
  .map((row) => row.match(/^(\d+)-(\d+)\s*(.)\s*:\s*(.+)$/))
  .map(([, min, max, char, password]) => ({
    min: Number(min),
    max: Number(max),
    char,
    password,
  }));

const solve1 = () =>
  inputs.filter(
    ({ min, max, char, password }) =>
      (password[min - 1] === char && password[max - 1] !== char) ||
      (password[max - 1] === char && password[min - 1] !== char)
  ).length;

require("./helper")(solve1);
