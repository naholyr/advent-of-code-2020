const { readFileSync } = require("fs");

const input = readFileSync("20-input.txt", "utf-8").split("\n");

const debug = process.env.DEBUG ? console.log : () => {};

// Tile = 10x10, so each 12 lines = 1 tile
range10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const rev = (s) => [...s].reverse().join("");
const toi = (s) => parseInt(s.replace(/#/g, "1").replace(/\./g, "0"), 2);
let tiles = new Map();
for (let i = 0; i < input.length / 12; i++) {
  const match = input[i * 12].match(/^Tile (\d+)/);
  const index = Number(match[1]);
  const top = input[i * 12 + 1];
  const top_flipped = rev(top);
  const bottom_flipped = input[i * 12 + 10];
  const bottom = rev(bottom_flipped);
  const left_flipped = range10.reduce(
    (s, j) => s + input[i * 12 + 1 + j][0],
    ""
  );
  const left = rev(left_flipped);
  const right = range10.reduce((s, j) => s + input[i * 12 + 1 + j][9], "");
  const right_flipped = rev(right);
  tiles.set(index, [
    [toi(top), toi(right), toi(bottom), toi(left)],
    [
      toi(top_flipped),
      toi(right_flipped),
      toi(bottom_flipped),
      toi(left_flipped),
    ],
  ]);
}

// It's about finding the 4 corners, which are the only 4 tiles with 2 sides *not* matching any other

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;
const itos = ["top", "right", "bottom", "left"];

const findSideMatch = (index, flipped = false) => {
  const tile = tiles.get(index)[flipped ? 1 : 0];
  return (side) => {
    const n = tile[side];
    debug(flipped ? index + "*" : index, side, n);
    let found = null;
    tiles.forEach(([tile0, tile1], i) => {
      if (found !== null) return;
      if (i === index) return;
      const i0 = tile0.indexOf(n);
      if (i0 !== -1) {
        debug(
          "%s%s (%s) = %s (%s)",
          index,
          flipped ? "*" : "",
          itos[side],
          i,
          itos[i0]
        );
        found = i;
        return;
      }
      const i1 = tile1.indexOf(n);
      if (i1 !== -1) {
        debug(
          "%s%s (%s) = %s* (%s)",
          index,
          flipped ? "*" : "",
          itos[side],
          i,
          itos[i1]
        );
        found = i;
      }
    });
    return found;
  };
};

const getMatches = (index, flipped = false) => {
  debug("\nGET MATCHES", flipped ? index + "*" : index);
  const _findSideMatch = findSideMatch(index, flipped);
  const left = _findSideMatch(LEFT);
  const right = _findSideMatch(RIGHT);
  const top = _findSideMatch(TOP);
  const bottom = _findSideMatch(BOTTOM);
  debug("Tile %s: %s / %s / %s / %s", index, top, right, bottom, left);
  return { left, right, top, bottom };
};

const getNbMatches = (index, flipped = false) => {
  const { left, right, top, bottom } = getMatches(index, flipped);
  return (
    (top === null ? 0 : 1) +
    (right === null ? 0 : 1) +
    (bottom === null ? 0 : 1) +
    (left === null ? 0 : 1)
  );
};

const isCorner = (index) => {
  // it's a corner if 2 of its sides do **not** match any other tile
  const nb0 = getNbMatches(index, false);
  const nb1 = getNbMatches(index, true);
  debug("Tile %s: %s | %s", index, nb0, nb1);
  return Math.max(nb0, nb1) === 2;
};

debug(tiles);

let corners = [];
tiles.forEach((tile, index) => {
  const foundCorner = isCorner(index);
  if (foundCorner) {
    corners.push(index);
  }
  console.log(
    " - %s %s",
    index,
    foundCorner ? "is a corner!" : "is not a corner"
  );
});

console.log("Found %s corners", corners.length);

console.log(
  "Final result =",
  String(corners.reduce((res, n) => res * BigInt(n), 1n))
);
