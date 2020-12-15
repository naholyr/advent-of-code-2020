// Prepare
const { readFileSync } = require("fs");
const input = readFileSync("07-1-input.txt", "utf-8");

const solve1 = () => {
  const dict = input.split("\n").reduce(
    (map, line) =>
      map.set(
        line.match(/^(.+) bags contain/)[1],
        [...line.matchAll(/ (\d+) ([^,\.]+) bags?/g)].reduce(
          (counts, [, n, c]) => counts.set(c, Number(n)),
          new Map()
        )
      ),
    new Map()
  );
  const countContains = (color) =>
    [...dict.get(color)].reduce(
      (total, [c, n]) => total + n * countContains(c),
      1
    );
  return countContains("shiny gold") - 1;
};

const solve2 = () => {};

const solve3 = () => {};

require("./helper")(solve1, solve2, solve3);
