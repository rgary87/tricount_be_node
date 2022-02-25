class Distribution {
    static distribute(participants, current_participant, participant_share, to_distribute) {
        for (let to_refund_user of participants) {
            if (to_distribute === 0)
                return;
            if (current_participant.name === to_refund_user.name)
                continue;
            if (to_refund_user.payed_amount > participant_share) {
                let to_refund = to_refund_user.payed_amount - participant_share;
                if (to_distribute > to_refund) {
                    current_participant.refund_to.push({'name': to_refund_user.name, 'amount': to_refund});
                    to_refund_user.payed_amount -= to_refund;
                    current_participant.payed_amount += to_refund;
                    to_distribute -= to_refund;
                } else {
                    current_participant.refund_to.push({'name': to_refund_user.name, 'amount': to_distribute});
                    to_refund_user.payed_amount -= to_distribute;
                    current_participant.payed_amount += to_distribute;
                    to_distribute = 0;
                }
            }
        }
    }
}

module.exports = Distribution
