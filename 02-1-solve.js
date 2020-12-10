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

const solve1 = () => {
  const isOK = ({ min, max, char, password }, i) => {
    const count = password.split(char).length - 1;
    return count >= min && count <= max;
  };
  return inputs.filter(isOK).length;
};

// Attribute a prime number to each character
const atop = {};
[
  2n,
  3n,
  5n,
  7n,
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
  41n,
  43n,
  47n,
  53n,
  59n,
  61n,
  67n,
  71n,
  73n,
  79n,
  83n,
  89n,
  97n,
  101n,
].forEach((p, i) => {
  atop[String.fromCharCode(97 + i)] = p;
});

const solve2 = () => {
  const stop = (string) => {
    let n = 1n;
    for (let i = 0; i < string.length; i++) {
      n *= atop[string[i]];
    }
    return n;
  };
  const isOK = ({ min, max, char, password }, i) => {
    const n = stop(password);
    const p = atop[char];
    if (n % p ** BigInt(min) !== 0n) return false;
    if (n % p ** BigInt(max + 1) === 0n) return false;
    return true;
  };
  return inputs.filter(isOK).length;
};

require("./helper")(solve1, solve2);
