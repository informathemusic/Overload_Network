require('dotenv').config();

const FastSpeedtest = require("fast-speedtest-api");
const records = [];
let lost = 0;
let wFACount = 0;
let done = 0;
let t = [];
let latestProgress = 0;

const progressBarLength = 32;

const printInfo = (p) => {
  if (done < p) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Progress[${p - 1}]: [${'#'.repeat(progressBarLength)}] ${wFACount - 2 ** (p - 1) + 1} / ${2 ** (p - 1) - lost}\n`);
    console.log(`===
Speed [${p - 1}] (total ${2 ** (p - 1) - lost})
Total: ${records[p].toFixed(4)}
Average: ${(records[p] / (2 ** p - lost)).toFixed(4)}
Time: ${Date.now() - t[p]}
Lost: ${lost}
=== ===`);
    process.stdout.write(`Progress[${p}]: [${' '.repeat(progressBarLength)}] ${wFACount - 2 ** p + 1} / ${2 ** p - lost}`);
    done = p;
  }
};

const waitForAll = (p) => new Promise((r) => {
  wFACount++;
  p++;
  const interval = setInterval(() => {
    if (wFACount >= 2 ** p - lost - 1) {
      clearInterval(interval);
      lost *= 2;
      latestProgress = 0;
      printInfo(p);
      r();
    } else {
      const currentProgress = Math.floor(
        ((wFACount - 2 ** (p - 1)) / (2 ** (p - 1) - lost)) * progressBarLength
      );
      if (latestProgress < currentProgress) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Progress[${p - 1}]: [${'#'.repeat(currentProgress)}${' '.repeat(progressBarLength - currentProgress)}] \
${wFACount - 2 ** (p - 1)} / ${2 ** (p - 1) - lost}`);
        latestProgress = currentProgress;
      }
    }
  }, 100);
});

process.on('uncaughtException', () => { lost++; });

const C = async (l) => {
  if (!l) l = 0
  let speedtest = new FastSpeedtest({
    token: process.env.FAST_TOKEN,
    timeout: 1000,
    unit: FastSpeedtest.UNITS.Mbps, // default: Bps
  });
  if (!t[l + 1]) t[l + 1] = Date.now();
  try{
    const speed = await speedtest.getSpeed()
    records[l + 1] = (records[l + 1] || 0) + +speed.toFixed(4);
    await waitForAll(l);
    C(l + 1);
    C(l + 1);
  } catch (e) {
    lost++;
    if (2 ** p - lost - 1 === 0) {
      console.log(`===
Emptied out, retrying at rank 0
===`);
      C();
    }
  }
};

console.log('=== ===');
process.stdout.write(`Progress[0]: [${' '.repeat(progressBarLength)}] 0 / 1`);
C();
