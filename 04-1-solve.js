// Prepare
const { readFileSync } = require("fs");
const passports = readFileSync("04-1-input.txt", "utf-8")
  .trim()
  .split(/[\r\n]{2}/);

const RE_REQUIRED = /(?:byr|iyr|eyr|hgt|hcl|ecl|pid):/;

const solve1 = () =>
  passports.filter((p) => p.split(RE_REQUIRED).length - 1 >= 7).length;

require("./helper")(solve1);
