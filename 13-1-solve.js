// Prepare
const { readFileSync } = require("fs");

const [earliestLine, idsLine] = readFileSync("13-input.txt", "utf-8").split(
  "\n"
);
const earliest = Number(earliestLine);
const ids = idsLine
  .split(",")
  .filter((id) => id !== "x")
  .map(Number);

// departure = id × N where id × N >= earliest && id × (N - 1) < earliest
//                     <=>  N >= earliest / id && N < earliest / id + 1
//                     <=>  earliest / id <= N < earliest / id + 1
//                     <=>  N = ceiled division of earliest/id
const departures = ids.map((id) => [id, Math.ceil(earliest / id) * id]);
const [id, departure] = departures.reduce((min, cur) =>
  min[1] > cur[1] ? cur : min
);
const wait = departure - earliest;
const result = wait * id;
console.log({ id, departure, wait, result });
