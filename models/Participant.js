class Participant {
    constructor(name = "", total_spent = 0, payed_amount = 0, day_count = 1, owe_amount = 0, refund_to = []) {
        this.name = name;
        this.total_spent = total_spent;
        this.payed_amount = payed_amount;
        this.day_count = day_count;
        this.owe_amount = owe_amount;
        this.refund_to = refund_to;
    }

    static fromMongoDBs(results) {
        let list = [];
        for (let result of results) {
            list.push(this.fromMongoDB(result));
        }
        return list;
    }

    static fromMongoDB(result) {
        return new Participant(
            result['name'],
            result['total_spent'],
            result['payed_amount'],
            result['day_count'],
            result['owe_amount'],
            result['refund_to'],
        );
    }
}



module.exports = {
    Participant
}
