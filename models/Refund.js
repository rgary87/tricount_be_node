class Refund {
    constructor(from = '', to = '', amount = 0, done = false, idx = 0) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.done = done;
        this.idx = idx;
    }
}

module.exports = Refund
