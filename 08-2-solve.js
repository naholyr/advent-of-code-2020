// Prepare
const { count } = require("console");
const { readFileSync } = require("fs");
const input = readFileSync("08-1-input.txt", "utf-8");

/* idea:

the program terminates iff it reaches last instruction
so it terminates iff it reaches an instruction redirecting to last instruction
etc.

*/

const run = (instructions, verbose = false) => {
  let index = 0;
  let value = 0;
  let history = new Set();
  while (!history.has(index) && instructions[index]) {
    const [instr, arg] = instructions[index];
    let nextIndex = index + 1;
    if (instr === "acc") {
      value += Number(arg);
    } else if (instr === "jmp") {
      nextIndex = index + Number(arg);
    }
    if (verbose) console.log({ index, instr, arg, value });
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
  // Like previous step, just run the broken program
  const { history } = run(instructions, false);
  const jmpOrNop = Uint16Array.from(history.values()).filter(
    (i) => instructions[i][0] === "jmp" || instructions[i][0] === "nop"
  );
  console.log("Found %d 'jmp' or 'nop' instructions", jmpOrNop.length);
  const interesting = jmpOrNop.filter(
    (i) =>
      // Replacing "nop" with "jmp" would jmp to an already run instruction?
      (instructions[i][0] === "nop" &&
        !history.has(i + Number(instructions[i][1]))) ||
      // Replacing "jmp" with "nop" would jmp to an already run instruction?
      (instructions[i][0] === "jmp" && !history.has(i + 1))
  );
  console.log("Found %d instructions worth trying to fix", interesting.length);
  // Just try one by one 🤷
  let finalValue = 0;
  interesting.some((i) => {
    const newInstructions = [...instructions];
    newInstructions[i] = [
      instructions[i][0] === "jmp" ? "nop" : "jmp",
      instructions[i][1],
    ];
    const { value, terminated } = run(newInstructions);
    console.log(
      `${i}. "${instructions[i][0]} ${instructions[i][0]}" → "${
        newInstructions[i][0]
      } ${newInstructions[i][0]}"… ${terminated ? "OK" : "FAIL"}`
    );
    if (terminated) {
      finalValue = value;
      return true;
    }
  });
  return finalValue;
};
require("./helper")(solve1);
