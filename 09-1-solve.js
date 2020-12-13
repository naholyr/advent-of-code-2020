// Prepare
const { count } = require("console");
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
  for (let i = 25; i < input.length; i++) {
    const n = input[i];
    const sums = findSums(numbers, n);
    if (!sums.length) {
      console.log("%d: Invalid!", n);
      return n;
    }
    console.log(
      "%d = %s.",
      n,
      sums.map(([n1, n2]) => `${n1}+${n2}`).join(" or ")
    );
    numbers.shift();
    numbers.push(n);
  }
});
