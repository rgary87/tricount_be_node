const Refund = require("./models/Refund");

class Distribution {

    static getAmountPerParticipant(trip) {
        const participant_list = trip.participant_list;
        const spending_list = trip.spending_list;

        // reset eventual previous calculation
        participant_list.forEach(p => p.owe_amount = 0);
        participant_list.forEach(p => p.payed_amount = 0);
        let total_days = 0;
        participant_list.forEach(p => total_days += p.day_count);

        // distribute payed amounts to all concerned participants, prorated
        for (const spending of spending_list) {
            let days_for_this_spending = 0;
            for (const participant of participant_list) {
                if (spending.shared_with.includes(participant.name)) {
                    days_for_this_spending += participant.day_count;
                }
            }
            for (const participant of participant_list) {
                if (spending.shared_with.includes(participant.name)) {
                    let prorated_shared_amount = spending.amount / days_for_this_spending * participant.day_count;
                    participant.owe_amount += prorated_shared_amount;
                }
                if (spending.payed_by === participant.name) {
                    participant.payed_amount = spending.amount;
                    participant.total_spent = participant.payed_amount;
                }
            }
        }
        participant_list.forEach(p => p.owe_amount = p.owe_amount - p.payed_amount);
    }

    static distributeTrip(trip) {
        trip.participant_list.sort((a, b) => a.total_spent - b.total_spent);
        // console.log("After Sort: ");
        // console.log(trip.participant_list);
        for (let participant of trip.participant_list) {
            participant.payed_amount = participant.total_spent;
            participant.refund_to = [];
        }
        for (let participant of trip.participant_list) {
            if (participant.owe_amount > 0) {
                let to_distribute = participant.owe_amount;
                Distribution.distribute(trip.participant_list, participant, trip.amount_per_participant, to_distribute)
            }
        }
    }

    static distribute(participant_list, current_participant) {
        participant_list.sort((a, b) => a.owe_amount - b.owe_amount);

        for (const to_refund_participant of participant_list) {
            let to_distribute = current_participant.owe_amount;
            if (current_participant.owe_amount === 0 || to_refund_participant.owe_amount >= 0 || to_refund_participant.name === current_participant.name) {
                continue;
            }
            if (Math.abs(to_refund_participant.owe_amount) > to_distribute) {
                current_participant.refund_to.push(new Refund(current_participant.name, to_refund_participant.name, to_distribute, false));
                to_refund_participant.owe_amount += to_distribute;
                current_participant.owe_amount -= to_distribute;
            } else {
                let part_of_to_distribute = Math.abs(to_refund_participant.owe_amount);
                current_participant.refund_to.push(new Refund(current_participant.name, to_refund_participant.name, part_of_to_distribute, false));
                to_refund_participant.owe_amount += part_of_to_distribute;
                current_participant.owe_amount -= part_of_to_distribute;
            }
        }
    }

    static checkForRefunds(trip) {
        let refund_list = trip.refund_list;

        let participant_list = trip.participant_list;
        let participant_map = participant_list.reduce(function (map, participant) {
            map[participant.name] = participant;
            return map;
        }, {});

        for (const participant of participant_list) {
            for (const refund_to of participant.refund_to) {
                if (this.isRefundDone(refund_list, refund_to.from, refund_to.to)) {
                    participant.total_spent += refund_to.amount;
                    participant_map[refund_to.to].total_spent -= refund_to.amount;
                    refund_to.done = true;
                }
            }
        }
    }

    static isRefundDone(refund_list, from, to) {
        for (const refund of refund_list) {
            if (refund.from === from && refund.to === to) {
                return true;
            }
        }
        return false;
    }

}

module.exports = Distribution
