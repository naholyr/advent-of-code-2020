const { readFileSync } = require("fs");

console.log(
  String(
    [
      ...readFileSync("14-input.txt", "utf-8")
        .split("\n")
        .reduce(
          (o, line) => {
            let match;
            if ((match = line.match(/^mask\s*=\s*([X01]+)/))) {
              const maskString = match[1];
              o.mask = [
                // Force 0s = replace "X" with "1", and apply with operator "&"
                BigInt("0b" + maskString.replace(/X/g, "1")),
                // Force 1s = replace "X" with "0", and apply with operator "|"
                BigInt("0b" + maskString.replace(/X/g, "0")),
              ];
              //console.log(
              //  "mask",
              //  o.mask.map((n) => n.toString(2))
              //);
            } else if ((match = line.match(/^mem\[(\d+)\]\s*=\s*(\d+)/))) {
              o.mem.set(match[1], (BigInt(match[2]) & o.mask[0]) | o.mask[1]);
              //console.log("mem", match[1], match[2], o.mem.get(match[1]));
            } else {
              console.error("invalid", line);
            }
            return o;
          },
          { mem: new Map(), mask: null }
        )
        .mem.entries(),
    ].reduce((sum, [key, value]) => {
      return sum + value;
    }, 0n)
  )
);
