// Prepare
const { readFileSync } = require("fs");

// https://fr.wikipedia.org/wiki/Algorithme_d%27Euclide_%C3%A9tendu
// got lazy here, I have no more patience I just brute-force that shit
const euclShit = (𝓂i, 𝑛i) => {
  let 𝓿i = 1n;
  while ((𝓿i * 𝓂i) % 𝑛i !== 1n) 𝓿i++;
  return 𝓿i;
};

//const idsLine = "7,13,x,x,59,x,31,19"; // 1068781
//const idsLine = "17,x,13,19"; // 3417
//const idsLine = "67,7,59,61"; // 754018
//const idsLine = "67,x,7,59,61"; // 779210
//const idsLine = "67,7,x,59,61"; // 1261476
//const idsLine = "1789,37,47,1889"; // 1202161486
const [, idsLine] = readFileSync("13-input.txt", "utf-8").split("\n");

const firstPositive = (n, v) => n > 0 ? n : firstPositive(n + v, v);

const congruencies = idsLine
  .split(",")
  .map((v, i) => (v === "x" ? null : [BigInt(firstPositive(v-i, Number(v))), BigInt(v)]))
  .filter((v) => v);

const 𝓪is = congruencies.map(([𝓪i]) => 𝓪i);
const 𝑛is = congruencies.map(([, 𝑛i]) => 𝑛i);

console.log("find 𝑥 such as:");
𝑛is.forEach((𝑛i, i) =>
  console.log("  𝑥 ≡ %s (%s)", String(𝓪is[i]), String(𝑛i))
);

console.log("");

const 𝑛 = 𝑛is.reduce((𝑛, 𝑛i) => 𝑛 * 𝑛i, 1n);
console.log("𝑛 = %s = %s", 𝑛is.map(String).join("×"), String(𝑛));

const 𝓮is = 𝑛is.map((𝑛i, i) => {
  const 𝓂i = 𝑛 / 𝑛i; // multiply others between them
  const 𝓿i = euclShit(𝓂i, 𝑛i); // euclidian machin-truc (fuck it, brute-force that shit)
  const 𝓮i = 𝓿i * 𝓂i;
  console.log(
    "𝑛%s = %s, and 𝓂%s = %s, and %s𝓂%s ≡ 1 (%s) ⇒ 𝓮%s = %s",
    i + 1,
    String(𝑛i),
    i + 1,
    String(𝓂i),
    String(𝓿i),
    i + 1,
    String(𝑛i),
    i + 1,
    String(𝓮i)
  );
  return 𝓮i;
});

console.log("");

const possible𝓧 = 𝓪is.reduce((x, 𝓪i, i) => x + 𝓪i * 𝓮is[i], 0n);
console.log(
  "possible 𝑥 = %s = %s",
  𝓪is.map((𝓪i, i) => `${String(𝓪i)}×${String(𝓮is[i])}`).join(" + "),
  String(possible𝓧)
);

console.log("");

const 𝑥 = possible𝓧 % 𝑛;
console.log("lowest positive 𝑥 = %s", String(𝑥));

// find T such as for each (id, i) there is N integer such as T + i = id × N
//                            <=>  T = id × N - i
//                            <=>  T === -i (id)
// …
// …
// ???
// …
// OK LOL thanks Reddit → https://fr.wikipedia.org/wiki/Th%C3%A9or%C3%A8me_des_restes_chinois
//
//
