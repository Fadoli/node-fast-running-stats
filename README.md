# node-fast-running-stats

This is a JavaScript/Node.js library for computing running (or rolling) statistics for one value.

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

## Coverage

----------|---------|----------|---------|---------|---------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|---------------------
All files |   96.82 |    89.65 |     100 |   96.82 |
 index.js |   96.82 |    89.65 |     100 |   96.82 | 51-52,80-81,131-132
----------|---------|----------|---------|---------|---------------------
