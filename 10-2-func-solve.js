const { readFileSync } = require("fs");
const input = readFileSync("10-input.txt", "utf-8").split("\n").map(Number);

const combinationsOfConsecutive = (cache, n) => {
  if (n <= 2n) return [cache, 1n];
  if (n === 3n) return [cache, 2n];
  if (n === 4n) return [cache, 4n];
  if (!cache[n]) {
    const [cache3, n3] = combinationsOfConsecutive(cache, n - 3n);
    const [cache2, n2] = combinationsOfConsecutive(cache3, n - 2n);
    const [cache1, n1] = combinationsOfConsecutive(cache2, n - 1n);
    const result = n1 + n2 + n3;
    return [{ ...cache, [n]: result }, result];
  }
  return [cache, cache[n]];
};

console.log(
  [0, Math.max(...input) + 3, ...input]
    .sort((a, b) => a - b)
    .reduce(
      (ctx, n, i) => {
        if (i < adapters.length - 1) {
          const diff = adapters[i + 1] - n;
          if (diff === 3) {
            const [cache, multiplier] = combinationsOfConsecutive(
              ctx.cache,
              BigInt(ctx.consecutiveNumbers + 1)
            );
            return {
              cache,
              total: ctx.total * multiplier,
              consecutiveNumbers: 0,
            };
          } else {
            return { ...ctx, consecutiveNumbers: ctx.consecutiveNumbers + 1 };
          }
        }
        return ctx;
      },
      { cache: {}, consecutiveNumbers: 0, total: 1n }
    ).total
);
