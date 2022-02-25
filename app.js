const Distribution = require('./distribution.js')
const { klass: Participant, parseJSONtoTrip } = require('./models/Participant.js');
const Trip = require('./models/Trip.js');
const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json())
app.use(function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

const hostname = '127.0.0.1'
const port = 3000;

let trip = new Trip();

function exploit_trip(trip) {
    trip.participant_list.sort((a, b) => a.total_payed - b.total_payed);
    console.log("After Sort: ");
    console.log(trip.participant_list);
    for (let participant of trip.participant_list) {
        participant.payed_amount = participant.total_payed
        participant.refund_to = [];
    }
    for (let participant of trip.participant_list) {
        if (participant.payed_amount < trip.amount_per_participant) {
            to_distribute = trip.amount_per_participant - participant.payed_amount;
            Distribution.distribute(trip.participant_list, participant, trip.amount_per_participant, to_distribute)
        }
    }
}

app.get('/', function (req, res) {
    let a = [1, 2, 6, 3, 7, 2, 4];
    console.log(a);
    a.sort((a, b) => a - b);
    console.log(a);
    a.sort((a, b) => b - a);
    console.log(a);
    res.statusCode = 200;
    res.end('Hello World 2');
});

app.post('/', function (req, res) {
    console.log("Got post on / for data: " + JSON.stringify(req.body));
    trip = new Trip(
        req.body,
        0,
        0);
    exploit_trip(trip);
    res.statusCode = 200;
    res.json(trip);
    console.log("Post DONE")
});

const server = app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
