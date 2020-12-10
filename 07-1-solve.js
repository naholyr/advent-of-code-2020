// Prepare
const { readFileSync } = require("fs");
const input = readFileSync("07-1-input.txt", "utf-8");

const solve1 = () => {
  let total = new Set();
  let search = ["shiny gold"];
  let hasMatch = true;
  while (hasMatch) {
    const re = new RegExp(
      "(?:^|\n)(.+?) bags contain .*(?:\\d+ (?:" + search.join("|") + "))",
      "gm"
    );
    search = [...input.matchAll(re)]
      .map((m) => m[1])
      .filter((c) => !total.has(c));
    console.log(search);
    hasMatch = search.length > 0;
    search.forEach((c) => total.add(c));
  }
  return total.size;
};

const solve2 = () => {};

const solve3 = () => {};

require("./helper")(solve1, solve2, solve3);
