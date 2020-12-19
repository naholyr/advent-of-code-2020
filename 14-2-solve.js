const { readFileSync } = require("fs");

// JS does not support more than 32 bits for bitwise operations

const hi = 0x80000000n;
const low = 0x7fffffffn;
const lowhi = (n) => [n & low, ~~(n / hi)];
const bitop1 = (f) => (n) => {
  const [l, h] = lowhi(n);
  return f(h) * hi + f(l);
};
const bitop2 = (f) => (a, b) => {
  const [la, ha] = lowhi(a);
  const [lb, hb] = lowhi(b);
  return f(ha, hb) * hi + f(la, lb);
};
const bitop = (f) => (f.length === 1 ? bitop1 : bitop2)(f);

const not = bitop1((a) => ~a);
const and = bitop2((a, b) => a & b);
const or = bitop2((a, b) => a | b);

const applyFloatings = (n, floatings) => {
  if (floatings.length === 0) return [n];
  const [pow, ...rest] = floatings;
  const mask = BigInt(2 ** pow);
  return [
    // 0
    ...applyFloatings(and(n, not(mask)), rest),
    // 1
    ...applyFloatings(or(n, mask), rest),
  ];
};

console.log(
  String(
    [
      ...readFileSync("14-input.txt", "utf-8")
        .split("\n")
        .reduce(
          (o, line) => {
            console.log("\n>>> %s", line);
            let match;
            if ((match = line.match(/^mask\s*=\s*([X01]+)/))) {
              const maskString = match[1];
              // First force 1s and keep 0s unchanged = replace "X" with "0", and apply with operator "|"
              o.mask = BigInt("0b" + maskString.replace(/X/g, "0"));
              // Each X produce a new branch:
              o.floatings = [...maskString.matchAll(/X/g)].map(
                (m) => 35 - m.index
              );
              console.log(
                "mask = %s, floatings = %s",
                String(o.mask),
                o.floatings
              );
            } else if ((match = line.match(/^mem\[(\d+)\]\s*=\s*(\d+)/))) {
              const mems = applyFloatings(
                BigInt(match[1]) | o.mask,
                o.floatings
              );
              const value = BigInt(match[2]);
              mems.forEach((k) => {
                console.log(
                  `mem[%s (%s)] = %s`,
                  k.toString(2),
                  String(k),
                  String(value)
                );
                o.mem.set(k, value);
              });
            } else {
              console.error("invalid", line);
            }
            return o;
          },
          { mem: new Map(), mask: 0n, floatings: [] }
        )
        .mem.values(),
    ].reduce((sum, value) => {
      return sum + value;
    }, 0n)
  )
);
