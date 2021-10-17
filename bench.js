const fastStats = require("./src/index")
const sizes = [10, 100, 1000, 2000, 3000];
const iteration = 100;

/**
 * Basic computation of stats
 * @param {Array} array 
 * @returns 
 */
function computeStats(array) {
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    let variance = 0;
    let sum = 0;
    let n = array.length;

    array.forEach(element => {
        if (element < min) {
            min = element;
        }
        if (element > max) {
            max = element;
        }
        sum += element;
    });
    let avg = sum / n;
    array.forEach(element => {
        if (element < min) {
            min = element;
        }
        if (element > max) {
            max = element;
        }
        variance += (element - avg) * (element - avg);
    });
    variance = variance / n;

    return {
        n: n,
        min: min,
        max: max,
        sum: sum,
        mean: avg,
        variance: variance,
        standard_deviation: Math.sqrt(variance)
    };
}

class rollingArray {
    constructor(size) {
        this.array = [];
        this.maxSize = size;
        this.pos = 0;
    }
    push(num) {
        if (this.array.length < this.maxSize) {
            this.array.push(num);
        } else {
            if (this.pos >= this.maxSize) {
                this.pos -= this.maxSize;
            }
            this.array[this.pos] = num;
        }
        this.pos++;
    }
}

function benchmark(size) {
    let rawData = [];
    for (let i = 0; i < 2 * size; i++) {
        rawData.push(Math.random());
    }
    let results = {};
    console.time(`simple rollingArray implem, size = ${size}`);
    for (let i = 0; i < iteration; i++) {
        let myArray = new rollingArray(size);
        rawData.forEach((elem) => {
            myArray.push(elem);
            results.simple = computeStats(myArray.array);
        })
    }
    console.timeEnd(`simple rollingArray implem, size = ${size}`);
    console.time(`fastStats implem, size = ${size}`);
    for (let i = 0; i < iteration; i++) {
        let myArray = new fastStats(size);
        rawData.forEach((elem) => {
            results.fastStats = myArray.append(elem).getStats();
        })
    }
    console.timeEnd(`fastStats implem, size = ${size}`);
    console.log(results);
}

sizes.forEach((size) => {
    benchmark(size);
})
