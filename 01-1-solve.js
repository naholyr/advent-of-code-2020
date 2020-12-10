const { readFileSync } = require("fs");
const input = readFileSync("01-1-input.txt", "utf8")
  .trim()
  .split(/[\r\n]+/);

const solve1 = () => {
  // ascending
  const numbers = Uint16Array.from(input).sort();

  // start with small numbers, and add the biggest one first
  let steps = 0;
  main: for (let i = 0; i < numbers.length; i++) {
    const a = numbers[i];
    for (let j = numbers.length - 1; j > i; j--) {
      const b = numbers[j];
      steps++;
      const sum = a + b;
      if (sum < 2020) {
        // next numbers will be lower, no need to go further
        continue main;
      }
      if (sum === 2020) {
        // found it!
        const product = a * b;
        return { a, b, sum, product, steps };
      }
    }
  }
};

const solve2 = () => {
  // ascending
  const numbers = Uint16Array.from(input).sort();

  // start with small numbers, and add the smallest ones (but still bigger) first
  let steps = 0;
  main: for (let i = 0; i < numbers.length; i++) {
    const a = numbers[i];
    for (let j = i; j < numbers.length; j++) {
      const b = numbers[j];
      steps++;
      const sum = a + b;
      if (sum > 2020) {
        // next numbers will be bigger, no need to go further
        continue main;
      }
      if (sum === 2020) {
        // found it!
        const product = a * b;
        return { a, b, sum, product, steps };
      }
    }
  }
};

const solve3 = () => {
  // no sort
  const numbers = Uint16Array.from(input);

  // dumb brute force with no premise
  let steps = 0;
  main: for (let i = 0; i < numbers.length; i++) {
    const a = numbers[i];
    for (let j = 0; j < numbers.length; j++) {
      if (j === i) continue;
      const b = numbers[j];
      steps++;
      const sum = a + b;
      if (sum === 2020) {
        // found it!
        const product = a * b;
        return { a, b, sum, product, steps };
      }
    }
  }
};

require("./helper")(solve1, solve2, solve3);
