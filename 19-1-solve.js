const { readFileSync } = require("fs");

const [rulesInput, messagesInput] = readFileSync("19-input.txt", "utf-8").split(
  "\n\n"
);

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

let resolved = false;
while (!resolved) resolved = resolve();
console.log("Resolved rules:");
console.log("  " + rules.map((r, i) => i + ": " + r).join("\n  ") + "\n");

// Simplify final regexp
const re = new RegExp("^" + rules[0] + "$");

console.log("Final rule (regexp):");
console.log(re);
console.log("");

let nbValid = 0;
const valid = (msg) => (re.test(msg) ? (nbValid++, true) : false);
console.log(
  "- " +
    messages
      .map((msg) => "[" + (valid(msg) ? "X" : " ") + "] " + msg)
      .join("\n- ") +
    "\n"
);
console.log("Total valid:", nbValid);
