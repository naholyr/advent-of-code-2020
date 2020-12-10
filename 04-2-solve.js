// Prepare
const { readFileSync } = require("fs");
const passports = readFileSync("04-1-input.txt", "utf-8")
  .trim()
  .split(/[\r\n]{2}/);

const RE_REQUIRED = new RegExp(
  [
    ["byr", "19[2-9][0-9]|200[0-2]"],
    ["iyr", "201[0-9]|2020"],
    ["eyr", "202[0-9]|2030"],
    ["hgt", "(?:(?:1[5-8][0-9]|19[0-3])cm)|(?:(?:59|6[0-9]|7[0-6])in)"],
    ["hcl", "#[0-9a-f]{6}"],
    ["ecl", "amb|blu|brn|gry|grn|hzl|oth"],
    ["pid", "[0-9]{9}"],
  ]
    .map(([field, re]) => `(?:(?:^|\s)${field}:(?:${re})(?:$|\s))`)
    .join("|")
);

// Not working, that's damn frustrating
const solve1 = () =>
  passports.filter(
    (p) => p.replace(/[\r\n\s]/g, "  ").split(RE_REQUIRED).length - 1 >= 7
  ).length;

const passportsObjects = passports.map((p) =>
  [
    ...p
      .replace(/[\r\n\s]/g, "  ")
      .matchAll(/(?:^|\s)(byr|iyr|eyr|hgt|hcl|ecl|pid):(.+?)(?:\s|$)/g),
  ].reduce((o, [, f, v]) => ((o[f] = v), o), {})
);

const ecls = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);

const solve2 = () =>
  passportsObjects.filter((p, i) => {
    const byr = Number(p.byr);
    if (!(1920 <= byr && byr <= 2002)) return false;
    const iyr = Number(p.iyr);
    if (!(2010 <= iyr && iyr <= 2020)) return false;
    const eyr = Number(p.eyr);
    if (!(2020 <= eyr && eyr <= 2030)) return false;
    if (!p.hgt) return false;
    const hgtv = Number(p.hgt.substr(0, p.hgt.length - 2));
    const hgtu = p.hgt.substr(p.hgt.length - 2);
    if (
      !(
        (hgtu === "cm" && 150 <= hgtv && hgtv <= 193) ||
        (hgtu === "in" && 59 <= hgtv && hgtv <= 76)
      )
    )
      return false;
    if (!p.hcl || !p.hcl.match(/^#[0-9a-f]{6}$/)) return false;
    if (!ecls.has(p.ecl)) return false;
    if (!p.pid || !p.pid.match(/^[0-9]{9}$/)) return false;
    return true;
  }).length;

require("./helper")(solve1, solve2);
