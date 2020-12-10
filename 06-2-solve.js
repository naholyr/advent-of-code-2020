// Prepare
const { readFileSync } = require("fs");
const input = readFileSync("06-1-input.txt", "utf-8");

const solve1 = () =>
  input
    .trim()
    .split("\n\n")
    .reduce((total, group) => {
      const persons = group.split("\n").sort((a, b) => a.length - b.length);
      const chrs = new Set(persons.shift());
      persons.forEach((person) => {
        chrs.forEach((chr) => {
          if (!~person.indexOf(chr)) chrs.delete(chr);
        });
      });
      return total + chrs.size;
    }, 0);

const solve2 = () => {
  let total = 0;
  let count = new Map();
  let nbPersonsInGroup = 0;
  let metNewLine = false;
  const fixedInput = input + "\n\n";
  for (let i = 0; i < fixedInput.length; i++) {
    const c = fixedInput[i];
    if (c !== "\n") {
      metNewLine = false;
    }
    if (c >= "a" && c <= "z") {
      // new char
      count.set(c, count.has(c) ? count.get(c) + 1 : 1);
    } else if (c === "\n") {
      // new group if previous was already new line
      if (metNewLine) {
        // new group (or end of file)
        count.forEach((n, c) => {
          if (n === nbPersonsInGroup) total += 1;
        });
        count.clear();
        nbPersonsInGroup = 0;
      } else {
        metNewLine = true;
        // new person
        nbPersonsInGroup += 1;
      }
    } else {
      console.error("unexpected", c);
    }
  }
  return total;
};

require("./helper")(solve1, solve2);
