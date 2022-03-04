const {Participant} = require("./Participant");

class Trip {
    constructor(participant_list = [], spending_list = [], refund_list = [], total_amount = 0, default_number_of_days = 0, isInit = false) {
        this.default_number_of_days = default_number_of_days;
        this._total_amount = total_amount;
        this.spending_list = spending_list;
        this.refund_list = refund_list;
        this.participant_list = participant_list;
        this.isInit = isInit;
    }

    static fromMongoDB(result) {
        return new Trip(
            Participant.fromMongoDBs(result.participant_list),
            [],
            result.total_amount,
            result.amount_per_participant
        )
    }
}

function parseJSONtoTrip(json) {
    if (!json.startsWith("[")) {
        throw "bad input json";
    }
    let parts = Object.assign([], JSON.parse(json));
    let oparts = []
    let participant_share = 0;
    for (let o in parts) {
        let participant = Object.assign(new Participant(), parts[o]);
        participant_share += participant.payed_amount;
        oparts.push(participant);
    }
    return new Trip(oparts, participant_share, participant_share / parts.length);
}

module.exports = {
    klass: Trip,
    parseJSONtoTrip
}
