const getMicroTime = () => {
  const [s, ns] = process.hrtime();
  return s * 1000000 + ns / 1000;
};

module.exports = (...fns) =>
  fns.forEach((fn, index) => {
    const start = getMicroTime();
    const result = fn();
    const end = getMicroTime();
    const duration = end - start;
    console.log({ index, duration, result });
  });
