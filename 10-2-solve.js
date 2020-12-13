// Prepare
const { count } = require("console");
const { readFileSync } = require("fs");
const input = readFileSync("10-input.txt", "utf-8").split("\n").map(Number);

require("./helper")(() => {
  // If 3 jolts diff there is only one adapter possible → this does not influence total number of combinations (×1)
  // So I just have to focus on groups of 1-jolt-diff adapters, which must be combined including first and last.
  // Let's check a few examples:
  // - 2 of them → only 1 possibility = does not influence (×1)
  // - 3 of them → 1-3 or 1-2-3 = 2 possibilities (×2 total combinations)
  // - 4 of them → 1-2-3-4,         // 1-jolt diff = only 1 way
  //               1-2-4, 1-3-4,    // 2-jolt diff = 2 ways
  //               1-4 = ×4         // 3-jolts diff = only 1 way
  // take a few more, as for next ones we won't have all possible combinations due to max +3:
  // - 5 of them → 1-2-3-4-5,                                    // 1 diff = 1
  //               1-2-3-5, 1-2-4-5, 1-3-4-5, 1-3-5,             // 2 diff = 4
  //               1-2-5, 1-4-5 = ×7                             // 3 diff = 2
  // - 6 of them → 1-2-3-4-5-6,                                  // 1-diff = 1
  //               1-3-4-5-6, 1-2-4-5-6, 1-2-3-5-6, 1-2-3-4-6,   // 2-diff = removing only one…
  //               1-3-5-6, 1-2-4-6, 1-3-4-6                     //          … or one in 3 consecutive = 7
  //               1-4-5-6, 1-4-6, 1-2-5-6, 1-2-3-6, 1-3-6       // 3-diff = 5
  // Looks like a fibonacci with 3 numbers, let's try to prove it?
  // What it we look at diffs instead of numbers:
  // - 2 of them → 1-2 → +1 = ×1
  // - 3 of them → +1+1 or +2 = ×2
  // - 4 of them → +1+1+1 or +1+2 or +2+1 or +3 = ×4
  // - 5 of them = +1 + any combination of 4, or +2 + any combination of 3, or +3 + any combination of 2 = ×7
  // - 6 of them = +1 + any combination of 5, or +2 + any combination of 3, or +4 + any combination of 3 = ×13
  // FUCKING GOT IT!
  // Sample: 1 2 5 6 7 10 11 12 → 0 1 2 5 6 7 10 11 12 15
  // 0 1 2 / 5 6 7 / 10 11 12 / 15 => 2 * 2 * 2 * 1 = 8 combinations
  // - 1. 0 1 2 5 6 7 10 11 12
  // - 2. 0   2 5 6 7 10 11 12
  // - 3. 0 1 2 5   7 10 11 12
  // - 4. 0 1 2 5 6 7 10    12
  // - 5. 0   2 5   7 10 11 12
  // - 6. 0   2 5 6 7 10    12
  // - 7. 0 1 2 5   7 10    12
  // - 8. 0   2 5   7 10    12
  // Other sample:   1 2 5 6 7 8 11 12 13 → 0 1 2 5 6 7 8 11 12 13 16
  // 0 1 2 / 5 6 7 8 / 11 12 13 / 16 = 2 * 4 * 2 * 1 = 16 combinations
  // - 01. 0 1 2 5 6 7 8 11 12 13 16
  // - 02. 0   2 5 6 7 8 11 12 13 16
  // - 03. 0 1 2 5   7 8 11 12 13 16
  // - 04. 0 1 2 5 6   8 11 12 13 16
  // - 05. 0 1 2 5 6 7 8 11    13 16
  // - 06. 0   2 5   7 8 11 12 13 16
  // - 07. 0   2 5 6   8 11 12 13 16
  // - 08. 0   2 5 6 7 8 11    13 16
  // - 09. 0 1 2 5   7 8 11    13 16
  // - 10. 0 1 2 5 6   8 11    13 16
  // - 11. 0 1 2 5     8 11 12 13 16
  // - 12. 0   2 5     8 11 12 13 16
  // - 13. 0   2 5   7 8 11    13 16
  // - 14. 0   2 5 6   8 11    13 16
  // - 15. 0 1 2 5     8 11    13 16
  // - 16. 0   2 5     8 11    13 16
  const cached = {};
  const combinationsOfConsecutive = (n) => {
    if (n <= 2n) return 1n;
    if (n === 3n) return 2n;
    if (n === 4n) return 4n;
    if (!cached[n]) {
      cached[n] =
        combinationsOfConsecutive(n - 1n) +
        combinationsOfConsecutive(n - 2n) +
        combinationsOfConsecutive(n - 3n);
    }
    return cached[n];
  };
  const adapters = input.slice().sort((a, b) => a - b);
  adapters.unshift(0); // the socket
  adapters.push(adapters[adapters.length - 1] + 3); // your device
  return adapters.reduce(
    (ctx, n, i) => {
      if (i < adapters.length - 1) {
        const diff = adapters[i + 1] - n;
        console.log("%d → %d (+%d)", n, adapters[i + 1], diff);
        ctx.consecutiveNumbers++;
        if (diff === 3) {
          // end of a 1-jolt-diff series
          const multiplier = combinationsOfConsecutive(
            BigInt(ctx.consecutiveNumbers)
          );
          ctx.multipliers.push(multiplier);
          ctx.total *= multiplier;
          ctx.consecutiveSeries.push(ctx.consecutiveNumbers);
          ctx.consecutiveNumbers = 0;
        } else if (diff !== 1) {
          throw new Error("NOTHING WORKS IF WE HAVE 2-JOLTS DIFF :o :o :o");
        }
      }
      return ctx;
    },
    {
      consecutiveNumbers: 0,
      consecutiveSeries: [],
      multipliers: [],
      total: 1n,
    }
  );
});
