const assert = require("assert");
const { readFileSync } = require("fs");

const tests = [
  ["1 + (2 * 3) + (4 * (5 + 6))", 51],
  ["2 * 3 + (4 * 5)", 46],
  ["5 + (8 * 3 + 9 + 3 * 4 * 3)", 1445],
  ["5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))", 669060],
  ["((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2", 23340],
];

// Helper: debug
const debug = process.env.DEBUG ? console.log : () => {};

// Helper: calculate once tokenized (no parentheses)
// Precedence = addition, then multiplication
const RE_ADDITION = /(\d+)\s*\+\s*(\d+)/g;
const _calc = (expr) => {
  // Handle additions
  let prev;
  do {
    debug("CALC (add)", expr);
    prev = expr;
    expr = expr.replace(RE_ADDITION, (match, a, b) => Number(a) + Number(b));
  } while (prev !== expr);
  // Handle multiplications
  debug("CALC (mult)", expr);
  const result = expr.split(/\s*\*\s*/).reduce((res, n) => res * Number(n), 1);
  debug("CALC (end)", result);
  return result;
};

// Calculate full expression
const RE_PARENTHESES = /\(([^\(\)]+)\)/g;
const calc = (expr) => {
  // First, handle parentheses until there are not anymore
  let prev;
  do {
    debug("EXPR", expr);
    prev = expr;
    expr = expr.replace(RE_PARENTHESES, (match, innerExpr) => _calc(innerExpr));
  } while (prev !== expr);
  // Final result
  return _calc(expr);
};

// Validate method
tests.forEach(([expr, expected]) => assert.equal(expected, calc(expr), expr));

// Calculate challenge's result
console.log(
  "TOTAL RESULT",
  readFileSync("18-input.txt", "utf-8")
    .split("\n")
    .reduce((sum, expr) => {
      const value = calc(expr);
      console.log(expr + " = " + value);
      return sum + value;
    }, 0)
);
