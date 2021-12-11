# node-fast-running-stats

This is a JavaScript/Node.js library for computing running (or rolling) statistics for one set of values.

Requires node 14 or more recent.

Can be found on :
* [npm](https://www.npmjs.com/package/@fadoli/node-fast-running-stats)
* [github](https://github.com/Fadoli/node-fast-running-stats)

## Usage

```js
const rollingArray = require("@fadoli/node-fast-running-stats");

// We will do stats on a maximum of 10 values (then last value override oldest one)
const myStats = new StatsArray(10);

myStats.append(0).getStats();
// { n: 1, min: 0, max: 0, sum: 0, mean: 0, variance: 0, standard_deviation: 0 }
myStats.append(1).getStats();
// { n: 2, min: 0, max: 1, sum: 1, mean: 0.5, variance: 0.25, standard_deviation: 0.5 }
```

## Performance and Results

you can run this on your machine `npm run bench`

For each size we run the computation 100 times.
We add twice the size one per one and compute the stats each time.
This means for size 10 we will compute stats on 1,2,3,4,5,6,7,8,9,10 entries at first, then on 10 entries 10 times.

```
simple rollingArray implem, size = 10: 3.336ms
fastStats implem, size = 10: 2.117ms

simple rollingArray implem, size = 100: 19.857ms
fastStats implem, size = 100: 5.889ms

simple rollingArray implem, size = 1000: 1.349s
fastStats implem, size = 1000: 7.2ms

simple rollingArray implem, size = 2000: 5.109s
fastStats implem, size = 2000: 14.279ms

simple rollingArray implem, size = 3000: 11.629s
fastStats implem, size = 3000: 23.957ms
```

Here is the difference in output when both methods are compared :

```js
{
  simple: {
    n: 3000,
    min: 0.00009501596644567734,
    max: 0.9999407084813299,
    sum: 1514.788964278203,
    mean: 0.504929654759401,
    variance: 0.08372214898153563,
    standard_deviation: 0.28934779933764077
  },
  fastStats: {
    n: 3000,
    min: 0.00009501596644567734,
    max: 0.9999407084813299,
    sum: 1514.7889642781986,
    mean: 0.5049296547593995,
    variance: 0.08372328892386063,
    standard_deviation: 0.28934976917886185
  }
}
```

This module's approach creates more errors related to the float precision errors (more computation are done and re-used and as such float precision errors are added as times goes on). The result is recomputed after a certain amount of times (2 times the size of the array, or at least 25k) to prevent it from causing big errors.

## Coverage

File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 | 
 index.js |     100 |      100 |     100 |     100 | 
