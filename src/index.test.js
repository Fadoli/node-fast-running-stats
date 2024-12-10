let describe, it;
if (typeof Bun !== 'undefined') {
    describe = require('bun:test').describe;
    it = require('bun:test').test;
} else {
    describe = require('node:test').describe;
    it = require('node:test').it;
}

const assert = require('assert');
const StatsArray = require('./index');

const TEST_PRECISION = 1000000000; // 10^-9 precision (9 can fail on sum/avg)

function applyPrecision(obj, precision = TEST_PRECISION) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
        obj[key] = Math.round(obj[key] * precision) / precision;
    })
    return obj;
}

describe('statsArray', () => {
    it('should not have stats when empty', () => {
        const stat = new StatsArray(10);
        assert.deepStrictEqual(stat.getStats(), null);
    });

    it('should have good stats: 0', () => {
        const stat = new StatsArray(10);
        stat.append(0);
        assert.deepStrictEqual(stat.getStats(), { "n": 1, "min": 0, "max": 0, "sum": 0, "mean": 0, "variance": 0, "standard_deviation": 0 });
    });

    it('should have good stats: 1', () => {
        const stat = new StatsArray(10);
        stat.append(1);
        assert.deepStrictEqual(stat.getStats(), { "n": 1, "min": 1, "max": 1, "sum": 1, "mean": 1, "variance": 0, "standard_deviation": 0 });
    });

    it('should have good stats: -1', () => {
        const stat = new StatsArray(10);
        stat.append(-1);
        assert.deepStrictEqual(stat.getStats(), { "n": 1, "min": -1, "max": -1, "sum": -1, "mean": -1, "variance": 0, "standard_deviation": 0 });
    });

    it('should recompute internally', () => {
        const stat = new StatsArray(10);
        let qt = stat.nextCompute + 1;
        while (qt--) {
            stat.append(Math.random());
        }
        const output = stat.getStats();
        assert.strictEqual(output.n, 10);
    });

    it('should properly compute min', () => {
        const stat = new StatsArray(2);
        stat.append(1);
        assert.strictEqual(stat.getStats().min, 1);
        stat.append(2);
        assert.strictEqual(stat.getStats().min, 1);
        stat.append(3);
        assert.strictEqual(stat.getStats().min, 2);
        stat.append(1);
        assert.strictEqual(stat.getStats().min, 1);
        stat.append(1);
        assert.strictEqual(stat.getStats().min, 1);
        stat.append(1);
        assert.strictEqual(stat.getStats().min, 1);
    });

    it('should properly compute max', () => {
        const stat = new StatsArray(2);
        stat.append(1);
        assert.strictEqual(stat.getStats().max, 1);
        stat.append(2);
        assert.strictEqual(stat.getStats().max, 2);
        stat.append(3);
        assert.strictEqual(stat.getStats().max, 3);
        stat.append(2);
        assert.strictEqual(stat.getStats().max, 3);
        stat.append(1);
        assert.strictEqual(stat.getStats().max, 2);
        stat.append(1);
        assert.strictEqual(stat.getStats().max, 1);
        stat.append(1);
        assert.strictEqual(stat.getStats().max, 1);
    });

    it('should compute data on the go (2 size)', () => {
        const stat = new StatsArray(2);
        stat.append(1);
        assert.deepStrictEqual(stat.getStats(), { n: 1, min: 1, max: 1, sum: 1, mean: 1, variance: 0, standard_deviation: 0 });
        stat.append(0);
        assert.deepStrictEqual(stat.getStats(), { n: 2, min: 0, max: 1, sum: 1, mean: 0.5, variance: 0.25, standard_deviation: 0.5 });
        assert.deepStrictEqual(stat.recompute(), { n: 2, min: 0, max: 1, sum: 1, mean: 0.5, variance: 0.25, standard_deviation: 0.5 });
    });

    it('Compute data on the go (2 same value)', () => {
        const stat = new StatsArray(2);
        stat.append(1);
        assert.deepEqual(stat.getStats(), { n: 1, min: 1, max: 1, sum: 1, mean: 1, variance: 0, standard_deviation: 0 });
        stat.append(1);
        assert.deepEqual(stat.getStats(), { n: 2, min: 1, max: 1, sum: 2, mean: 1, variance: 0, standard_deviation: 0 });
        assert.deepEqual(stat.recompute(), { n: 2, min: 1, max: 1, sum: 2, mean: 1, variance: 0, standard_deviation: 0 });
    });

    it('should compute data on the go', () => {
        const stat = new StatsArray(10);
        stat.append(1);
        assert.deepStrictEqual(stat.getStats(), { n: 1, min: 1, max: 1, sum: 1, mean: 1, variance: 0, standard_deviation: 0 });
        stat.append(-1);
        assert.deepStrictEqual(stat.getStats(), { n: 2, min: -1, max: 1, sum: 0, mean: 0, variance: 1, standard_deviation: 1 });
        stat.append(1);
        assert.deepStrictEqual(stat.getStats(), { n: 3, min: -1, max: 1, sum: 1, mean: 1 / 3, variance: 0.888888888888889, standard_deviation: 0.9428090415820634 });
        stat.append(-1);
        assert.deepStrictEqual(stat.getStats(), { n: 4, min: -1, max: 1, sum: 0, mean: 0, variance: 1, standard_deviation: 1 });

        stat.append(1);
        stat.append(-1);
        stat.append(1);
        stat.append(-1);
        stat.append(1);
        stat.append(-1);
        // Final stats
        assert.deepStrictEqual(stat.getStats(), { n: 10, min: -1, max: 1, sum: 0, mean: 0, variance: 1, standard_deviation: 1 });
    });

    it('should compute data on the go and correctly (no overwrite)', () => {
        const array = [];
        const SIZE = 42;
        let qt = SIZE;
        while (qt) {
            array[qt--] = Math.random() * 5;
        }

        const stat1 = new StatsArray(SIZE);

        array.forEach(element => {
            stat1.append(element);
        });

        const res1 = applyPrecision(stat1.getStats());
        const res2 = applyPrecision(stat1.recompute());
        assert.deepStrictEqual(res1, res2);
    });

    it('should compute data on the go and correctly (with overwrite)', () => {
        const array = [];
        const SIZE = 42;
        let qt = SIZE;
        while (qt) {
            array[qt--] = Math.random() * 5;
        }

        const stat1 = new StatsArray(SIZE);

        array.forEach(element => {
            stat1.append(element);
        });
        array.forEach(() => {
            stat1.append(0);
        });

        // Important note :
        // t.test is possible that due to how t.test is computed (incrementaly) variance changes a tad
        // This means we have to reduce the number of digt.test that matters
        const res1 = applyPrecision(stat1.getStats());
        const res2 = applyPrecision(stat1.recompute());
        assert.deepEqual(res1, res2);

        assert.equal(res1.mean, 0);
        assert.equal(res1.min, 0);
        assert.equal(res1.variance, 0);
    });
});
