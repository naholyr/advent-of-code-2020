// Perf notes:
// Using POJO = never getting results (exponential time, accessing properties seems slower and slower)
// Using Map = way way faster!
// Using simple loop outside generator = ~10% faster, I just keep the generator for the fun

//const input = [0, 3, 6];
//const input = [1, 3, 2];
const input = [0, 12, 6, 13, 20, 1, 17];

const stop = 30000000;

const debug = process.env.DEBUG ? console.log : () => {};

const series = function* () {
  let said = new Map();
  let prev = null;
  for (let turn = 1; ; turn++) {
    const n =
      turn <= input.length
        ? // starting numbers
          debug("Turn %s: starting number", turn) || input[turn - 1]
        : // has last number already been spoken?
        said.has(prev)
        ? // yes → how many turns ago?
          debug(
            "Turn %s: %s has been said on turn %s",
            turn,
            prev,
            said.get(prev)
          ) || turn - 1 - said.get(prev)
        : // no → 0
          debug("Turn %s: %s had never been said before", turn, prev) || 0;
    if (prev !== null) said.set(prev, turn - 1);
    debug("Turn %s: %s", turn, said);
    prev = n;
    yield n;
  }
};

const it = series();
for (let i = 0; i < stop - 1; i++) {
  const { value } = it.next();
  debug("Turn %s → %s", i + 1, value);
}

console.log("Turn %s → %s", stop, it.next().value);
