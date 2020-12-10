// Prepare
const { readFileSync } = require("fs");
const input = readFileSync("06-1-input.txt", "utf-8");

const solve1 = () =>
  input
    .trim()
    .split("\n\n")
    .reduce(
      (total, group) => total + new Set(group.replace(/[^a-z]/gs, "")).size,
      0
    );

const solve2 = () => {
  let total = 0;
  let chrs = new Set();
  let metNewLine = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c !== "\n") {
      metNewLine = false;
    }
    if (c >= "a" && c <= "z") {
      // mark as used
      chrs.add(c);
    } else if (c === "\n") {
      // new group if previous was already new line
      if (metNewLine) {
        // new group
        total += chrs.size;
        chrs.clear();
      } else {
        metNewLine = true;
      }
    } else {
      console.error("unexpected", c);
    }
  }
  return total + chrs.size;
};

const solve3 = () => {
  let total = 0;
  let chrs = {};
  let metNewLine = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c !== "\n") {
      metNewLine = false;
    }
    if (c >= "a" && c <= "z") {
      // mark as used
      if (!chrs[c]) {
        chrs[c] = 1;
        total += 1;
      }
    } else if (c === "\n") {
      // new group if previous was already new line
      if (metNewLine) {
        // new group
        chrs = {};
      } else {
        metNewLine = true;
      }
    } else {
      console.error("unexpected", c);
    }
  }
  return total;
};

require("./helper")(solve1, solve2, solve3);
