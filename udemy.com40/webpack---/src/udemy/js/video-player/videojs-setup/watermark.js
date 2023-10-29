export default class Watermark {
    highest = 0;
    lastTotal = 0;

    add(newTotal, secsSamplePeriod) {
        const sample = (newTotal - this.lastTotal) / secsSamplePeriod;
        if (sample > this.highest) {
            this.highest = sample;
        }
        this.lastTotal = newTotal;
    }
}
