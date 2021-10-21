const test = require("zora").test;
const StatsArray = require("./index");

const TEST_PRECISION = 1000000000; // 10^-9 precision (9 can fail on sum/avg)

function applyPrecision(obj, precision = TEST_PRECISION) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
        obj[key] = Math.round(obj[key] * precision) / precision;
    })
    return obj;
}


test("statsArray", (t) => {
    t.test('should not have stats when empty', function () {
        const stat = new StatsArray(10);
        t.deepEqual(stat.getStats(), null);
    });


    t.test('should have good stats : 0', function () {
        const stat = new StatsArray(10);
        stat.append(0);
        t.deepEqual(stat.getStats(), { "n": 1, "min": 0, "max": 0, "sum": 0, "mean": 0, "variance": 0, "standard_deviation": 0 });
    });
    t.test('should have good stats : 1', function () {
        const stat = new StatsArray(10);
        stat.append(1);
        t.deepEqual(stat.getStats(), { "n": 1, "min": 1, "max": 1, "sum": 1, "mean": 1, "variance": 0, "standard_deviation": 0 });
    });
    t.test('should have good stats : -1', function () {
        const stat = new StatsArray(10);
        stat.append(-1);
        t.deepEqual(stat.getStats(), { "n": 1, "min": -1, "max": -1, "sum": -1, "mean": -1, "variance": 0, "standard_deviation": 0 });
    });
    t.test('should recompute internally', function () {
        const stat = new StatsArray(10);
        let qt = stat.nextCompute + 1;
        while (qt--){
            stat.append(Math.random());
        }
        const output = stat.getStats();
        t.equal(output.n, 10);
    });


    t.test('should properly compute min', function () {
        const stat = new StatsArray(2);
        stat.append(1);
        t.deepEqual(stat.getStats().min, 1);
        stat.append(2);
        t.deepEqual(stat.getStats().min, 1);
        stat.append(3);
        t.deepEqual(stat.getStats().min, 2);
        stat.append(1);
        t.deepEqual(stat.getStats().min, 1);
        stat.append(1);
        t.deepEqual(stat.getStats().min, 1);
        stat.append(1);
        t.deepEqual(stat.getStats().min, 1);
    });
    t.test('should properly compute max', function () {
        const stat = new StatsArray(2);
        stat.append(1);
        t.deepEqual(stat.getStats().max, 1);
        stat.append(2);
        t.deepEqual(stat.getStats().max, 2);
        stat.append(3);
        t.deepEqual(stat.getStats().max, 3);
        stat.append(2);
        t.deepEqual(stat.getStats().max, 3);
        stat.append(1);
        t.deepEqual(stat.getStats().max, 2);
        stat.append(1);
        t.deepEqual(stat.getStats().max, 1);
        stat.append(1);
        t.deepEqual(stat.getStats().max, 1);
    });

    t.test('Compute data on the go (2 size)', function () {
        const stat = new StatsArray(2);
        stat.append(1);
        t.deepEqual(stat.getStats(), { n: 1, min: 1, max: 1, sum: 1, mean: 1, variance: 0, standard_deviation: 0 });
        stat.append(0);
        t.deepEqual(stat.getStats(), { n: 2, min: 0, max: 1, sum: 1, mean: 0.5, variance: 0.25, standard_deviation: 0.5 });
        t.deepEqual(stat.recompute(), { n: 2, min: 0, max: 1, sum: 1, mean: 0.5, variance: 0.25, standard_deviation: 0.5 });
    });

    t.test('Compute data on the go (2 same value)', function () {
        const stat = new StatsArray(2);
        stat.append(1);
        t.deepEqual(stat.getStats(), { n: 1, min: 1, max: 1, sum: 1, mean: 1, variance: 0, standard_deviation: 0 });
        stat.append(1);
        t.deepEqual(stat.getStats(), { n: 2, min: 1, max: 1, sum: 2, mean: 1, variance: 0, standard_deviation: 0 });
        t.deepEqual(stat.recompute(), { n: 2, min: 1, max: 1, sum: 2, mean: 1, variance: 0, standard_deviation: 0 });
    });

    t.test('Compute data on the go', function () {
        const stat = new StatsArray(10);
        stat.append(1);
        t.deepEqual(stat.getStats(), { n: 1, min: 1, max: 1, sum: 1, mean: 1, variance: 0, standard_deviation: 0 });
        stat.append(-1);
        t.deepEqual(stat.getStats(), { n: 2, min: -1, max: 1, sum: 0, mean: 0, variance: 1, standard_deviation: 1 });
        stat.append(1);
        t.deepEqual(stat.getStats(), { n: 3, min: -1, max: 1, sum: 1, mean: 1 / 3, variance: 0.888888888888889, standard_deviation: 0.9428090415820634 });
        stat.append(-1);
        t.deepEqual(stat.getStats(), { n: 4, min: -1, max: 1, sum: 0, mean: 0, variance: 1, standard_deviation: 1 });

        stat.append(1);
        stat.append(-1);
        stat.append(1);
        stat.append(-1);
        stat.append(1);
        stat.append(-1);
        // Final stats
        t.deepEqual(stat.getStats(), { n: 10, min: -1, max: 1, sum: 0, mean: 0, variance: 1, standard_deviation: 1 });
    });

    t.test('Compute data on the go : and correctly (no over-wrt)', function () {
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

        // Important note :
        // t.test is possible that due to how t.test is computed (incrementaly) variance changes a tad
        // This means we have to reduce the number of digt.test that matters
        const res1 = applyPrecision(stat1.getStats());
        const res2 = applyPrecision(stat1.recompute());
        t.deepEqual(res1, res2);
    });

    t.test('Compute data on the go : and correctly (with over-wrt)', function () {
        const array = [];
        const SIZE = 42;
        let qt = SIZE;
        while (qt) {
            array[qt--] = Math.random() * 5;
        }

        const stat1 = new StatsArray(SIZE);

        // Random data
        array.forEach(element => {
            stat1.append(element);
        });
        // Full 0
        array.forEach(element => {
            stat1.append(0);
        });

        // Important note :
        // t.test is possible that due to how t.test is computed (incrementaly) variance changes a tad
        // This means we have to reduce the number of digt.test that matters
        const res1 = applyPrecision(stat1.getStats());
        const res2 = applyPrecision(stat1.recompute());
        t.deepEqual(res1, res2);

        t.equal(res1.mean, 0);
        t.equal(res1.min, 0);
        t.equal(res1.variance, 0);
    });
});