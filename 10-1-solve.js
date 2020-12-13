// Prepare
const { count } = require("console");
const { readFileSync } = require("fs");
const input = readFileSync("10-input.txt", "utf-8").split("\n").map(Number);

require("./helper")(() => {
  const adapters = input.slice().sort((a, b) => a - b);
  adapters.unshift(0); // the socket
  adapters.push(adapters[adapters.length - 1] + 3); // your device
  const differences = adapters.reduce(
    (res, n, i) => {
      if (i < adapters.length - 1) {
        res[adapters[i + 1] - n] += 1;
      }
      return res;
    },
    { 1: 0, 2: 0, 3: 0 }
  );
  console.log("adapters", adapters);
  console.log("differences", differences);
  return differences[1] * differences[3];
});
