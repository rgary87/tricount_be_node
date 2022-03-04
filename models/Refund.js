class Refund {
    constructor(from = '', to = '', amount = 0, done = false) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.done = done;
    }
}

module.exports = Refund
