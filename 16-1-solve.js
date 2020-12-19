const { readFileSync } = require("fs");

const { rules, tickets } = readFileSync("16-input.txt", "utf-8")
  .split("\n")
  .reduce(
    (o, line) => {
      if (line === "") {
        if (o.step === "rules") o.step = "tickets";
      } else if (o.step === "rules") {
        const [, field, min1, max1, min2, max2] = line.match(
          /(.+)\s*:\s*(\d+)-(\d+) or (\d+)-(\d+)/
        );
        o.rules.push({
          field,
          ranges: [
            [Number(min1), Number(max1)],
            [Number(min2), Number(max2)],
          ],
        });
      } else if (o.step === "tickets" && line.match(/^\d+(,\d+)*$/)) {
        o.tickets.push(line.split(",").map(Number));
      }
      return o;
    },
    { rules: [], tickets: [], step: "rules" }
  );

// We just care about the invalid values: we can merge all rules to have less ranges
const ranges = rules.reduce(
  (rs, r) =>
    r.ranges.reduce((all, [min, max]) => {
      // check if "min" is in or next to an existing range (include min-1, max+1)
      // → yes = extend this existing range's max
      // → no = check for "max"
      //        → yes = extend this existing range's min
      //        → no = add new range
      const foundMin = all.find((r) => r[0] - 1 <= min && min <= r[1] + 1);
      if (foundMin) {
        if (foundMin[1] < max) foundMin[1] = max;
      } else {
        const foundMax = all.find((r) => r[0] - 1 <= max && max <= r[1] + 1);
        if (foundMax) {
          if (foundMax[0] > min) foundMax[0] = min;
        } else {
          all.push([min, max]);
        }
      }
      return all;
    }, rs),
  []
);

console.log("Merged ranges:", ranges);

let validTickets = 0;
const total = tickets.reduce((sum, values, index) => {
  const invalids = values.filter(
    (v) => !ranges.some(([min, max]) => min <= v && v <= max)
  );
  if (invalids.length === 0) {
    validTickets++;
    console.log("Valid ticket! #%s  (%s)", index, values.join(","));
  } else {
    console.log(
      "Invalid ticket! #%s  (%s) → %s",
      index,
      values.join(","),
      invalids.join(",")
    );
  }
  return sum + invalids.reduce((a, b) => a + b, 0);
}, 0);

console.log("Valid tickets: %s", validTickets);

console.log("Total invalid values:", total);
