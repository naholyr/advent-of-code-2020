const { readFileSync } = require("fs");
const numbers = Uint16Array.from(
  readFileSync("01-2-input.txt", "utf8")
    .trim()
    .split(/[\r\n]+/)
);

// ascending
numbers.sort();

const solve1 = () => {
  const min = numbers[0];

  // start with big numbers and add the small ones
  let steps = 0;
  main: for (let i = numbers.length - 1; i > 0; i--) {
    const a = numbers[i];
    sub: for (let j = 0; j < i; j++) {
      const b = numbers[j];
      if (a + b + min > 2020) {
        continue main;
      }
      for (let k = j + 1; k < i; k++) {
        const c = numbers[k];
        steps++;
        const sum = a + b + c;
        if (sum > 2020) {
          // next numbers will be bigger, no need to go further
          continue sub;
        }
        if (sum === 2020) {
          // found it!
          const product = a * b * c;
          console.log("→", { a, b, c, i, j, k, sum, product, steps });
          break main;
        }
      }
    }
  }
};

require("./helper")(solve1);
