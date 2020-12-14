// Prepare
const { count } = require("console");
const { readFileSync } = require("fs");

const r = { E: "S", S: "W", W: "N", N: "E" };
const l = { E: "N", S: "E", W: "S", N: "W" };

readFileSync("12-input.txt", "utf-8")
  .split("\n")
  .map((s) => [s[0], Number(s.substr(1))])
  .reduce(
    ([dir, x, y], [target, dist], index) => {
      let dir2 = dir,
        x2 = x,
        y2 = y;
      if (target === "L" || target === "R") {
        const nbRots = dist / 90;
        for (let i = 0; i < nbRots; i++) {
          dir2 = (target === "L" ? l : r)[dir2];
        }
      } else {
        const moveDir = target === "F" ? dir : target;
        x2 = moveDir === "W" ? x + dist : moveDir === "E" ? x - dist : x;
        y2 = moveDir === "N" ? y + dist : moveDir === "S" ? y - dist : y;
      }
      console.log(
        "%s. %s %s,%s   %s  →   %s %s,%s   →   %s",
        String(index).padStart(3, " "),
        dir,
        String(x).padStart(5, " "),
        String(y).padStart(5, " "),
        `${target} ${dist}`.padEnd(6, " "),
        dir2,
        String(x2).padStart(5, " "),
        String(y2).padStart(5, " "),
        Math.abs(x2) + Math.abs(y2)
      );
      return [dir2, x2, y2];
    },
    ["E", 0, 0]
  );
