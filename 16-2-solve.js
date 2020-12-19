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

const validRules = (value) =>
  rules.filter(({ ranges }) =>
    ranges.some(([min, max]) => min <= value && value <= max)
  );

const validTickets = tickets.filter((values) =>
  values.every((value) => validRules(value).length > 0)
);

console.log("Valid tickets: %s", validTickets.length);

const possibleFieldsForValue = (value) => validRules(value).map((r) => r.field);

const intersect = (a1, a2) => a1.filter((v) => a2.includes(v));

const possibleFields = validTickets.reduce((fields, values) => {
  if (fields === null) return values.map(possibleFieldsForValue);
  return values.map((v, index) =>
    intersect(possibleFieldsForValue(v), fields[index])
  );
}, null);

// Cleanup found result: we may have at least one unique possibiliy: get it, store it and cleanup again
const findUniqueFields = (possibleFields, found = {}) => {
  const index = possibleFields.findIndex((fs) => fs.length === 1);
  if (index === -1) {
    // last one!
    return found;
  }
  // Found a unique:
  const field = possibleFields[index][0];
  return findUniqueFields(
    possibleFields.map((fs) => fs.filter((f) => f !== field)),
    { ...found, [field]: index }
  );
};

const positions = findUniqueFields(possibleFields);
const fields = Object.keys(positions).reduce(
  (a, f) => ((a[positions[f]] = f), a),
  []
);
console.log("Fields:", fields.join(", "));

const departureValues = tickets[0].filter((value, index) => {
  if (fields[index].startsWith("departure")) {
    console.log("%s = %s", fields[index], value);
    return true;
  }
  return false;
});

console.log(
  "Final result:",
  departureValues.reduce((a, b) => a * b, 1)
);
