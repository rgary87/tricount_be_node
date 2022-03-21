const Refund = require("./models/Refund");

class Distribution {

    static getAmountPerParticipant(trip) {
        const participant_list = trip.participant_list;
        const spending_list = trip.spending_list;

        // reset eventual previous calculation
        participant_list.forEach(p => p.owe_amount = 0);
        participant_list.forEach(p => p.payed_amount = 0);
        participant_list.forEach(p => p.total_spent = 0);


        // distribute payed amounts to all concerned participants, prorated
        for (const spending of spending_list) {
            let shareAll = spending.shared_with.length === 1 && spending.shared_with[0] === 'all';
            let days_for_this_spending = 0;
            for (const participant of participant_list) {
                if (shareAll || spending.shared_with.includes(participant.name)) {
                    days_for_this_spending += participant.day_count;
                }
            }
            for (const participant of participant_list) {
                if (shareAll || spending.shared_with.includes(participant.name)) {
                    let prorated_shared_amount = spending.amount / days_for_this_spending * participant.day_count;
                    participant.owe_amount += prorated_shared_amount;
                }
                if (spending.payed_by === participant.name) {
                    participant.payed_amount += spending.amount;
                    participant.total_spent += spending.amount;
                }
            }
        }
        participant_list.forEach(p => p.owe_amount = p.owe_amount - p.payed_amount);
    }

    static distributeTrip(trip) {
        trip.participant_list.sort((a, b) => a.total_spent - b.total_spent);
        let save_owe = new Map();
        for (let participant of trip.participant_list) {
            participant.payed_amount = participant.total_spent;
            participant.refund_to = [];
            save_owe.set(participant.name, participant.owe_amount);
        }
        let refund_idx = 0;
        for (let participant of trip.participant_list) {
            console.log("Refund_idx: %o", refund_idx);
            if (participant.owe_amount > 0) {
                refund_idx = Distribution.distribute(trip.participant_list, participant, refund_idx)
            }
        }
        trip.participant_list.forEach(p => p.owe_amount = save_owe.get(p.name));
    }

    static distribute(participant_list, current_participant, refund_idx) {
        participant_list.sort((a, b) => a.owe_amount - b.owe_amount);
        for (const to_refund_participant of participant_list) {
            let to_distribute = current_participant.owe_amount;
            if (current_participant.owe_amount === 0 || to_refund_participant.owe_amount >= 0 || to_refund_participant.name === current_participant.name) {
                continue;
            }
            if (Math.abs(to_refund_participant.owe_amount) > to_distribute) {
                current_participant.refund_to.push(new Refund(current_participant.name, to_refund_participant.name, to_distribute, false, refund_idx++));
                to_refund_participant.owe_amount += to_distribute;
                current_participant.owe_amount -= to_distribute;
            } else {
                let part_of_to_distribute = Math.abs(to_refund_participant.owe_amount);
                current_participant.refund_to.push(new Refund(current_participant.name, to_refund_participant.name, part_of_to_distribute, false, refund_idx++));
                to_refund_participant.owe_amount += part_of_to_distribute;
                current_participant.owe_amount -= part_of_to_distribute;
            }
        }
        return refund_idx;
    }

    static checkForRefunds(trip) {
        let participant_list = trip.participant_list;
        let participant_map = participant_list.reduce(function (map, participant) {
            map[participant.name] = participant;
            return map;
        }, {});

        for (const participant of participant_list) {
            for (const refund_to of participant.refund_to) {
                if (refund_to.done) {
                    participant.total_spent += refund_to.amount;
                    participant.owe_amount -= refund_to.amount;
                    participant_map[refund_to.to].total_spent -= refund_to.amount;
                }
            }
        }
    }
}

module.exports = Distribution
