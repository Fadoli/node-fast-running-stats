const RECOMPUTE_COUNT = 25000;

/**
 * @description This class will compute fast statistics on an array of numbers
 * @class statsArray
 */
class statsArray {
    /**
     * @description Creates an instance of statsArray.
     * @param {number} [size=100]
     * @memberof statsArray
     */
    constructor(size = 100) {
        this.size = size;
        this.array = new Array(size);

        this.index = 0;
        this.n = 0;
        this.q = 0;
        /**
         * @type {number}
         */
        this.min = Number.MAX_VALUE;
        this.minIndex = undefined;
        this.max = -Number.MAX_VALUE;
        this.maxIndex = undefined;
        this.sum = 0;
        this.mean = 0;

        this.nextCompute = Math.max(2 * this.size, RECOMPUTE_COUNT);
    }

    /**
     * @description Internal function to recompute min value
     * @memberof statsArray
     */
    #computeMin() {
        let iteration;
        // Go the other way around so that we have most chance to find the min 'farther' away from our position
        let iterator = this.index;
        let min = this.max + 1;
        let minIndex;
        for (iteration = 0; iteration < this.n; iteration++) {
            iterator--;
            if (iterator < 0) {
                iterator += this.size;
            }
            const element = this.array[iterator];
            if (element < min) {
                minIndex = iterator;
                min = element;
            }
        }
        this.minIndex = minIndex;
        this.min = min;
    }
    /**
     * @description Internal function to recompute max value
     * @memberof statsArray
     */
    #computeMax() {
        let iteration;
        // Go the other way around so that we have most chance to find the max 'farther' away from our position
        let iterator = this.index;
        let max = this.min - 1;
        let maxIndex;
        for (iteration = 0; iteration < this.n; iteration++) {
            iterator--;
            if (iterator < 0) {
                iterator += this.size;
            }
            const element = this.array[iterator];
            if (element > max) {
                maxIndex = iterator;
                max = element;
            }
        }
        this.maxIndex = maxIndex;
        this.max = max;
    }


    /**
     * @description Add a new entry for this fast-statistic computation
     * @param {number} newEntry
     * @returns {statsArray} itself
     * @memberof statsArray
     */
    append(newEntry) {
        const previousEntry = this.array[this.index];
        // If we have a previous entry we remove it from the sum, mean and q
        if (previousEntry !== undefined) {
            this.sum -= previousEntry;
            const prevMean = this.mean;
            this.mean = this.sum / this.n;
            this.q -= (previousEntry - prevMean) * (previousEntry - this.mean);
            // q should never be negative, so if it is negative we set it to zero
            if (this.q < 0) {
                this.q = 0;
            }
        } else {
            this.n++;
        }
        this.array[this.index] = newEntry;

        if (newEntry <= this.min) {
            this.minIndex = this.index;
            this.min = newEntry;
        } else if (this.minIndex === this.index) {
            this.#computeMin();
        }
        if (newEntry >= this.max) {
            this.maxIndex = this.index;
            this.max = newEntry;
        } else if (this.maxIndex === this.index) {
            this.#computeMax();
        }

        this.sum += newEntry;
        const prevMean = this.mean;
        this.mean = this.sum / this.n;
        this.q += (newEntry - prevMean) * (newEntry - this.mean);
        // q should never be negative, so if it is negative we set it to zero
        if (this.q < 0) {
            this.q = 0;
        }

        this.index = (this.index + 1) % this.size;

        this.nextCompute--;
        if (this.nextCompute === 0) {
            this.recompute();
        }

        return this;
    }

    /**
     * @description Get the stats with all current elements :)
     * @returns {{n: number, min: number, max: number, sum: number, mean: number, variance: number, standard_deviation: number}}
     * @memberof statsArray
     */
    getStats() {
        if (this.n === 0) {
            return null;
        }
        const variance = this.q / this.n;
        return {
            n: this.n,
            min: this.min,
            max: this.max,
            sum: this.sum,
            mean: this.mean,
            variance: variance,
            standard_deviation: Math.sqrt(variance)
        }
    }

    /**
     * @description We will compute proper variance here (reset float computation error)
     * @returns {{n: number, min: number, max: number, sum: number, mean: number, variance: number, standard_deviation: number}}
     * @memberof statsArray
     */
    recompute() {
        // Reinit compute count
        this.nextCompute = Math.max(2 * this.size, RECOMPUTE_COUNT);

        this.q = 0;
        this.sum = 0;
        this.array.forEach(element => {
            this.sum += element;
        });
        this.mean = this.sum / this.n;
        this.array.forEach(element => {
            this.q = this.q + (element - this.mean) * (element - this.mean);
        });
        const variance = this.q / this.n;
        return {
            n: this.n,
            min: this.min,
            max: this.max,
            sum: this.sum,
            mean: this.mean,
            variance: variance,
            standard_deviation: Math.sqrt(variance)
        };
    }
};

module.exports = statsArray;
