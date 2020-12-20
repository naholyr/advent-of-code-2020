const { readFileSync } = require("fs");

// In each cycle, only active cubes, or direct neighbors of active cubes, can change state

const activeCubes = readFileSync("17-input.txt", "utf-8")
  .split("\n")
  .reduce(
    (set, line, y) =>
      [...line.trim()].reduce(
        (s, char, x) => (char === "#" ? s.add(`${x},${y},0`) : s),
        set
      ),
    new Set()
  );

const isActive = (activeCubes) => (position) =>
  (position = activeCubes.has(position));

const _getNeighbors = ([x, y, z]) => [
  `${x - 1},${y - 1},${z - 1}`,
  `${x + 0},${y - 1},${z - 1}`,
  `${x + 1},${y - 1},${z - 1}`,
  `${x - 1},${y + 0},${z - 1}`,
  `${x + 0},${y + 0},${z - 1}`,
  `${x + 1},${y + 0},${z - 1}`,
  `${x - 1},${y + 1},${z - 1}`,
  `${x + 0},${y + 1},${z - 1}`,
  `${x + 1},${y + 1},${z - 1}`,
  `${x - 1},${y - 1},${z + 0}`,
  `${x + 0},${y - 1},${z + 0}`,
  `${x + 1},${y - 1},${z + 0}`,
  `${x - 1},${y + 0},${z + 0}`,
  `${x + 1},${y + 0},${z + 0}`,
  `${x - 1},${y + 1},${z + 0}`,
  `${x + 0},${y + 1},${z + 0}`,
  `${x + 1},${y + 1},${z + 0}`,
  `${x - 1},${y - 1},${z + 1}`,
  `${x + 0},${y - 1},${z + 1}`,
  `${x + 1},${y - 1},${z + 1}`,
  `${x - 1},${y + 0},${z + 1}`,
  `${x + 0},${y + 0},${z + 1}`,
  `${x + 1},${y + 0},${z + 1}`,
  `${x - 1},${y + 1},${z + 1}`,
  `${x + 0},${y + 1},${z + 1}`,
  `${x + 1},${y + 1},${z + 1}`,
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
  const [minX, maxX, minY, maxY, minZ, maxZ] = [...activeCubes].reduce(
    ([minX, maxX, minY, maxY, minZ, maxZ], position) => {
      const [x, y, z] = position.split(",").map(Number);
      return [
        minX === undefined ? x : Math.min(minX, x),
        maxX === undefined ? x : Math.max(maxX, x),
        minY === undefined ? y : Math.min(minY, y),
        maxY === undefined ? y : Math.max(maxY, y),
        minZ === undefined ? z : Math.min(minZ, z),
        maxZ === undefined ? z : Math.max(maxZ, z),
      ];
    },
    []
  );

  const info = `${minX},${minY},${minZ} → ${maxX},${maxY},${maxZ}`;

  const width = Math.max(
    `z = ${minZ}`.length,
    `z = ${maxZ}`.length,
    info.length,
    maxX - minX + 1
  );
  console.log("+-" + "-".repeat(width) + "-+");
  console.log("| " + " ".repeat(width) + " |");
  console.log("| " + info + " ".repeat(width - info.length) + " |");
  console.log("| " + " ".repeat(width) + " |");
  for (let z = minZ; z <= maxZ; z++) {
    const title = `z = ${z}`;
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
