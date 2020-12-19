//const input = [0, 3, 6];
const input = [0, 12, 6, 13, 20, 1, 17];

const debug = process.env.DEBUG ? console.log : () => {};

const series = function* () {
  let said = {};
  let prev = null;
  for (let turn = 1; ; turn++) {
    const n =
      turn <= input.length
        ? // starting numbers
          debug("Turn %s: starting number", turn) || input[turn - 1]
        : // has last number already been spoken?
        prev in said
        ? // yes → how many turns ago?
          debug(
            "Turn %s: %s has been said on turn %s",
            turn,
            prev,
            said[prev]
          ) || turn - 1 - said[prev]
        : // no → 0
          debug("Turn %s: %s had never been said before", turn, prev) || 0;
    if (prev !== null) said[prev] = turn - 1;
    debug("Turn %s: %s", turn, said);
    prev = n;
    yield n;
  }
};

const stop = 2020;

const it = series();
for (let i = 0; i < stop - 1; i++) {
  const { value } = it.next();
  debug("Turn %s → %s", i + 1, value);
}

console.log("Turn %s → %s", stop, it.next().value);
