// Prepare
const { readFileSync } = require("fs");
const input = readFileSync("09-input.txt", "utf-8").split("\n").map(Number);

const findSums = (numbers, sum) =>
  numbers
    .reduce(
      (pairs, n1, i1) =>
        numbers.reduce((pairs, n2, i2) => {
          if (i1 !== i2 && n1 + n2 === sum) {
            pairs.push([n1, n2]);
          }
          return pairs;
        }, pairs),
      []
    )
    .filter((p) => !!p);

require("./helper")(() => {
  let numbers = input.slice(0, 25);
  let weakNumber, weakIndex;
  for (let i = 25; i < input.length; i++) {
    const n = input[i];
    const sums = findSums(numbers, n);
    if (!sums.length) {
      console.log("Weak number: %d (line %d)", n, i + 1);
      weakNumber = n;
      weakIndex = i;
      break;
    }
    numbers.shift();
    numbers.push(n);
  }
  // Find valid sums in previous numbers
  let i, j;
  for (i = weakIndex - 1; i >= 0; i--) {
    // try previous ones until finding an equal or bigger result
    let sum = input[i];
    for (j = i - 1; j >= 0 && sum < weakNumber; j--) {
      sum += input[j];
    }
    if (sum === weakNumber) {
      const minIndex = j + 1;
      const maxIndex = i;
      const numbers = input.slice(j + 1, i + 1);
      const minNumber = Math.min(...numbers);
      const maxNumber = Math.max(...numbers);
      return {
        minIndex,
        maxIndex,
        numbers,
        sum,
        weakNumber,
        minNumber,
        maxNumber,
        weakness: minNumber + maxNumber,
      };
    }
  }
});
