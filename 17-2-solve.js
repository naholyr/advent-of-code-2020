const { readFileSync } = require("fs");

// In each cycle, only active cubes, or direct neighbors of active cubes, can change state

const activeCubes = readFileSync("17-input.txt", "utf-8")
  .split("\n")
  .reduce(
    (set, line, y) =>
      [...line.trim()].reduce(
        (s, char, x) => (char === "#" ? s.add(`${x},${y},0,0`) : s),
        set
      ),
    new Set()
  );

const isActive = (activeCubes) => (position) =>
  (position = activeCubes.has(position));

const _getNeighbors = (intPos, diff = []) =>
  diff.length === 4
    ? [
        `${intPos[0] + diff[0]},${intPos[1] + diff[1]},${intPos[2] + diff[2]},${
          intPos[3] + diff[3]
        }`,
      ]
    : [
        ..._getNeighbors(intPos, [...diff, -1]),
        ...(diff.length === 3 && diff[0] === 0 && diff[1] === 0 && diff[2] === 0
          ? // Exception: all diffs = 0, then skip this one
            []
          : _getNeighbors(intPos, [...diff, +0])),
        ..._getNeighbors(intPos, [...diff, +1]),
      ];

const getNeighbors = (position) =>
  _getNeighbors(position.split(",").map(Number));

const countActiveNeighbors = (activeCubes) => (position) =>
  getNeighbors(position)
    .map(isActive(activeCubes))
    .reduce((count, active) => count + (active ? 1 : 0), 0);

const getActiveAndNeighbors = (activeCubes) =>
  [...activeCubes].reduce(
    (set, position) =>
      getNeighbors(position).reduce(
        (s, position) => s.add(position),
        set.add(position)
      ),
    new Set()
  );

const cycle = (activeCubes) => {
  const positions = getActiveAndNeighbors(activeCubes);
  return [...positions].reduce((newActiveCubes, position) => {
    const neighbors = getNeighbors(position);
    const nbActiveNeighbors = countActiveNeighbors(activeCubes)(position);
    const active = isActive(activeCubes)(position);
    let change = "unchanged";
    if (active) {
      if (nbActiveNeighbors !== 2 && nbActiveNeighbors !== 3) {
        // set inactive
        change = "inactivated";
        newActiveCubes.delete(position);
      } else {
        // mark active if it was not already in set
        newActiveCubes.add(position);
      }
    } else {
      if (!active && nbActiveNeighbors === 3) {
        // set active
        newActiveCubes.add(position);
        change = "activated";
      } else {
        // nothing to do if it was not already marked as active, no need to delete
      }
    }
    /*console.log(
      "test %s (%s neighbours, %s active neighbours): %s → %s",
      position,
      neighbors.length,
      nbActiveNeighbors,
      active ? "active" : "inactive",
      change
    );*/
    return newActiveCubes;
  }, new Set());
};

const render = (activeCubes) => {
  // console.log(activeCubes);
  const [minX, maxX, minY, maxY, minZ, maxZ, minW, maxW] = [
    ...activeCubes,
  ].reduce(([minX, maxX, minY, maxY, minZ, maxZ, minW, maxW], position) => {
    const [x, y, z, w] = position.split(",").map(Number);
    return [
      minX === undefined ? x : Math.min(minX, x),
      maxX === undefined ? x : Math.max(maxX, x),
      minY === undefined ? y : Math.min(minY, y),
      maxY === undefined ? y : Math.max(maxY, y),
      minZ === undefined ? z : Math.min(minZ, z),
      maxZ === undefined ? z : Math.max(maxZ, z),
      minW === undefined ? w : Math.min(minW, w),
      maxW === undefined ? w : Math.max(maxW, w),
    ];
  }, []);

  const info = `${minX},${minY},${minZ},${minW} → ${maxX},${maxY},${maxZ},${maxW}`;

  const width = Math.max(
    `z = ${minZ}, w = ${minW}`.length,
    `z = ${minZ}, w = ${maxW}`.length,
    `z = ${maxZ}, w = ${minW}`.length,
    `z = ${maxZ}, w = ${maxW}`.length,
    info.length,
    maxX - minX + 1
  );
  console.log("+-" + "-".repeat(width) + "-+");
  console.log("| " + " ".repeat(width) + " |");
  console.log("| " + info + " ".repeat(width - info.length) + " |");
  console.log("| " + " ".repeat(width) + " |");
  for (let z = minZ; z <= maxZ; z++) {
    for (let w = minW; w <= maxW; w++) {
      const title = `z = ${z}, w = ${w}`;
      console.log("| " + title + " ".repeat(width - title.length) + " |");
      console.log("| " + " ".repeat(width) + " |");
      for (let y = minY; y <= maxY; y++) {
        let line = "";
        for (let x = minX; x <= maxX; x++) {
          const position = `${x},${y},${z}`;
          line += activeCubes.has(position) ? "#" : ".";
        }
        console.log(
          "| " + line + " ".repeat(Math.max(0, width - line.length)) + " |"
        );
      }
      console.log("| " + " ".repeat(width) + " |");
    }
  }
  console.log("+-" + "-".repeat(width) + "-+");
};

console.log("\nBefore any cycles:\n");
render(activeCubes);
console.log("\nActive cubes count (cycle 0) = %s\n", activeCubes.size);
let currentActiveCubes = activeCubes;
for (let i = 1; i <= 6; i++) {
  currentActiveCubes = cycle(currentActiveCubes);
  console.log("\nAfter %s cycle%s:\n", i, i > 1 ? "s" : "");
  render(currentActiveCubes);
  console.log(
    "\nActive cubes count (cycle %s) = %s\n",
    i,
    currentActiveCubes.size
  );
}
