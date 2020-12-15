// Prepare
const { readFileSync } = require("fs");

const r = { E: "S", S: "W", W: "N", N: "E" };
const l = { E: "N", S: "E", W: "S", N: "W" };

readFileSync("12-input.txt", "utf-8")
  .split("\n")
  .map((s) => [s[0], Number(s.substr(1))])
  .reduce(
    ([shipX, shipY, waypointX, waypointY], [c, d], index) => {
      let result;
      if (c === "L" || c === "R") {
        // rotate waypoint around ship (right: x,y → y,-x; left = x,y → -y,x)
        let x2 = waypointX,
          y2 = waypointY;
        const nbRots = d / 90;
        for (let i = 0; i < nbRots; i++) {
          [x2, y2] = c === "L" ? [-y2, x2] : [y2, -x2];
        }
        result = [shipX, shipY, x2, y2];
      } else if (c === "F") {
        // move ship
        const x2 = shipX + waypointX * d;
        const y2 = shipY + waypointY * d;
        result = [x2, y2, waypointX, waypointY];
      } else {
        // move waypoint
        const x2 = waypointX + (c === "W" ? -d : c === "E" ? +d : 0);
        const y2 = waypointY + (c === "N" ? +d : c === "S" ? -d : 0);
        result = [shipX, shipY, x2, y2];
      }
      console.log(
        "%s. %s,%s → %s,%s    %s   =>   %s,%s → %s,%s   ==>   %s",
        String(index).padStart(3, " "),
        String(shipX).padStart(5, " "),
        String(shipY).padEnd(5, " "),
        String(waypointX).padStart(5, " "),
        String(waypointY).padEnd(5, " "),
        `${c} ${d}`.padEnd(6, " "),
        String(result[0]).padStart(5, " "),
        String(result[1]).padEnd(5, " "),
        String(result[2]).padStart(5, " "),
        String(result[3]).padEnd(5, " "),
        Math.abs(result[0]) + Math.abs(result[1])
      );
      return result;
    },
    [0, 0, 10, 1]
  );
