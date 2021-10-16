const RECOMPUTE_COUNT = 25000;

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

        this.nextCompute = RECOMPUTE_COUNT;
    }

    /**
     * @description Internal function to recompute min value
     * @memberof statsArray
     */
    #computeMin() {
        let iteration;
        // Go the other way around so that we have most chance to find the min 'farther' away from our position
        let iterator = this.index;
        const previousMin = this.min;
        let min = this.max+1;
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
                // Don't look for another one, this was the previous min
                if (element === previousMin) {
                    break;
                }
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
        // Go the other way around so that we have most chance to find the min 'farther' away from our position
        let iterator = this.index;
        const previousMax = this.max;
        let max = this.min-1;
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
                // Don't look for another one, this was the previous max
                if (element === previousMax) {
                    break;
                }
            }
        }
        this.maxIndex = maxIndex;
        this.max = max;
    }


    /**
     * @description Add a new entry for this fast-statistic computation
     * @param {number} num
     * @returns
     */
    append(num) {
        const previousEntry = this.array[this.index];
        if (previousEntry !== undefined) {
            this.sum -= previousEntry;
            const prevMean = this.mean;
            this.mean = this.sum / this.n;
            this.q -= (previousEntry - prevMean) * (previousEntry - this.mean);
            if (this.q < 0) {
                this.q = 0;
            }
        } else {
            this.n++;
        }
        this.array[this.index] = num;

        if (num <= this.min) {
            this.minIndex = this.index;
            this.min = num;
        } else if (this.minIndex === this.index) {
            this.#computeMin();
        }
        if (num >= this.max) {
            this.maxIndex = this.index;
            this.max = num;
        } else if (this.maxIndex === this.index) {
            this.#computeMax();
        }

        this.sum += num;
        const prevMean = this.mean;
        this.mean = this.sum / this.n;
        this.q += (num - prevMean) * (num - this.mean);

        this.index = (this.index + 1) % this.size;

        this.nextCompute--;
        if (this.nextCompute === 0) {
            this.recompute();
        }

        return this;
    }

    /**
     * @description Get the stats with all current elements :)
     * @returns
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
     * @returns {Object}
     * @memberof statsArray
     */
    recompute() {
        // Reinit compute count
        this.nextCompute = RECOMPUTE_COUNT;

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
