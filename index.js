require('dotenv').config();

const FastSpeedtest = require("fast-speedtest-api");
const records = [];
let lost = 0;
let wFACount = 0;
let done = 0;
let t = [];
let latestProgress = 0;

const printInfo = (p, t) => {
  if (done < p) {
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(`Progress[${p - 1}]: [${'#'.repeat(16)}]\n`);
		console.log(`===
Speed [${p - 1}] (total ${2 ** (p - 1)})
Total: ${records[p].toFixed(4)}
Average: ${(records[p] / (2 ** p - lost)).toFixed(4)}
Time: ${Date.now() - t[p]}
Lost: ${lost}
=== ===`);
		process.stdout.write(`Progress[${p}]: [${' '.repeat(16)}]`);
    done = p;
  }
};

const waitForAll = (p) => new Promise((r) => {
  wFACount++;
  const interval = setInterval(() => {
    if (wFACount >= (2 ** (p + 1)) - (lost + 1)) {
      clearInterval(interval);
			lost *= 2;
			latestProgress = 0;
			printInfo(p, t);
      r();
		} else {
			const currentProgress = Math.floor(wFACount / ((2 ** (p + 1)) - (lost + 1)) * 16);
			if (latestProgress < currentProgress) {
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
				process.stdout.write(`Progress[${p - 1}]: [${'#'.repeat(currentProgress)}${' '.repeat(16 - currentProgress)}]`);
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
	if (!t[l]) t[l] = Date.now();
	try{
    const speed = await speedtest.getSpeed()
    records[l] = (records[l] || 0) + +speed.toFixed(4);
    await waitForAll(l);
    C(l + 1);
		C(l + 1);
	} catch (e) {
		lost++;
	}
};

console.log('=== ===');
process.stdout.write(`Progress[0]: [${' '.repeat(16)}]`);
C();
