const { readFileSync } = require("fs");

const [rulesInput, messagesInput] = readFileSync("19-input.txt", "utf-8")
  // adding two special cases, they'll be handled specifically
  .replace(/8: 42/, "8: 42 | 42 8")
  .replace(/11: 42 31/, "11: 42 31 | 42 11 31")
  .split("\n\n");

// rules : Array<string | Array<Array<ruleIndex: number>>>
const rules = rulesInput.split("\n").reduce((rules, rule) => {
  const [index, _description] = rule.split(":");
  const description = _description.trim();
  const newRules = description.startsWith('"')
    ? description.substring(1, description.length - 1)
    : description.split("|").map((seq) => seq.trim().split(/\s+/).map(Number));
  rules[Number(index)] = newRules;
  return rules;
}, []);

const messages = messagesInput.split("\n");

// Fully resolve rules

const isResolved = (ruleIndex) => typeof rules[ruleIndex] === "string";

const _resolve = (ruleIndex) => {
  if (isResolved(ruleIndex)) return true;
  let allAllString = true;
  rules[ruleIndex] = rules[ruleIndex].map((indices, i) => {
    let allString = true;
    if (typeof indices === "string") return indices;
    const newIndices = indices.map((index) => {
      if (typeof index === "string") return index;
      if (!isResolved(index)) {
        allString = false;
        return index;
      }
      return rules[index];
    });
    if (allString) {
      return newIndices.join("");
    } else {
      allAllString = false;
      return newIndices;
    }
  });
  if (allAllString) {
    rules[ruleIndex] = "(?:" + rules[ruleIndex].join("|") + ")";
    return true;
  }
  return false;
};

const resolve = () =>
  !rules.map((rule, index) => _resolve(index)).includes(false);

// Resolve with special cases removed
delete rules[0];
delete rules[8];
delete rules[11];
let resolved = false;
while (!resolved) resolved = resolve();

// Build final RE based on rules 42 and 31:
// 0: 8 11
// 8: 42 | 42 8          => (42)+
// 11: 42 31 | 42 11 31  => (42){n}(31){n}
// => 0: (42)+(42){n}(31){n}
// => matches iff (42)+ followed by (31)+ and nb of matched (42) is greater than matched (31)
// Idea:
// - Replace ^(42)(.+)(31)$ with (\2) until not matching
// - Remaining string must match ^(42)+$// Re-inject special cases
const reStart42Ends31 = new RegExp(
  "^(?:" + rules[42] + ")(.+)(?:" + rules[31] + ")$"
);
const re42Many = new RegExp("^(?:" + rules[42] + ")+$");
const isValid = (msg) => {
  let matched4231 = false;
  let prev;
  do {
    prev = msg;
    msg = msg.replace(reStart42Ends31, "$1");
    if (prev !== msg) {
      matched4231 = true;
    }
  } while (prev !== msg);
  return matched4231 && re42Many.test(msg);
};

let nbValid = 0;
const valid = (msg) => (isValid(msg) ? (nbValid++, true) : false);
console.log(
  "- " +
    messages
      .map((msg) => "[" + (valid(msg) ? "X" : " ") + "] " + msg)
      .join("\n- ") +
    "\n"
);
console.log("Total valid:", nbValid);
