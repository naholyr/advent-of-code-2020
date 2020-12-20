const assert = require("assert");
const { readFileSync } = require("fs");

const tests = [
  ["1 + (2 * 3) + (4 * (5 + 6))", 51],
  ["2 * 3 + (4 * 5)", 26],
  ["5 + (8 * 3 + 9 + 3 * 4 * 3)", 437],
  ["5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))", 12240],
  ["((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2", 13632],
];

// Helper: debug
const debug = process.env.DEBUG ? console.log : () => {};

// Helper: apply operator
const __calc = (a, op, b) =>
  op === "+" ? Number(a) + Number(b) : op === "*" ? Number(a) * Number(b) : NaN;

// Helper: calculate once tokenized (no parentheses)
// No precedence, left to right
const _calc = (expr) => {
  let tokens = expr.split(" ");
  while (tokens.length >= 3) {
    const [e1, op, e2, ...rest] = tokens;
    debug("CALC", e1, op, e2, rest);
    tokens = [__calc(e1, op, e2), ...rest];
  }
  debug("CALC (end)", tokens);
  return tokens[0];
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
