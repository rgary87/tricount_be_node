const Trip = require('./Trip.js')

class Participant {
    constructor(name = "", total_payed = 0, payed_amount = 0, owe_amount = 0, refund_to = []) {
        this.name = name;
        this.total_payed = total_payed;
        this.payed_amount = payed_amount;
        this.owe_amount = owe_amount;
        this.refund_to = refund_to;
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
    klass: Participant,
    parseJSONtoTrip
}
