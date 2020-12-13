// Prepare
const { count } = require("console");
const { readFileSync } = require("fs");
const input = readFileSync("08-1-input.txt", "utf-8");

const run = (instructions) => {
  let index = 0;
  let value = 0;
  let history = new Set();
  while (!history.has(index) && instructions[index]) {
    const [instr, arg] = instructions[index];
    let nextIndex = index + 1;
    if (instr === "acc") {
      value += arg;
    } else if (instr === "jmp") {
      nextIndex = index + arg;
    }
    console.log({ index, instr, arg, value });
    history.add(index); // mark as executed
    index = nextIndex;
  }
  return { value, terminated: !instructions[index], history };
};

const solve1 = () => {
  let instructions = input.split("\n").map((line, index) => {
    const [instr, arg] = line.trim().split(" ");
    return [instr, Number(arg)];
  });
  return run(instructions);
};
require("./helper")(solve1);
