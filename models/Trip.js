class Trip {
    constructor(participant_list = [], total_amount = 0, amount_per_participant = 0) {
        this.participant_list = participant_list;
        this.total_amount = total_amount;
        this.amount_per_participant = amount_per_participant;
        if (participant_list.length > 0 && total_amount === 0) {
            for (let p of participant_list) {
                this.total_amount += p.total_payed;
            }
            this.amount_per_participant = this.total_amount / this.participant_list.length;
        }
    }
}

module.exports = Trip
