const Distribution = require('./distribution.js')
const { klass: Participant } = require('./models/Participant.js');
const MongoDataAccess = require('./MongoDataAccess');
const { klass: Trip, parseJSONtoTrip} = require('./models/Trip.js');
const express = require('express');
const cors = require('cors')
const app = express();

const {tripRouter} = require('./controller/TripRest');
const {participantRouter} = require('./controller/ParticipantRest');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

const hostname = '0.0.0.0'
const port = 3000;

let trip = new Trip();

function exploit_trip(trip) {
    trip.participant_list.sort((a, b) => a.total_spent - b.total_spent);
    console.log("After Sort: ");
    console.log(trip.participant_list);
    for (let participant of trip.participant_list) {
        participant.payed_amount = participant.total_spent;
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

app.post('/spending', async function (req, res) {
    console.log("Got post on /spending for data: " + JSON.stringify(req.body));
    const trip = req.body;

    let m = new MongoDataAccess();
    let result = await m.insert(trip);
    res.statusCode = 200;
    res.json(result);
    console.log("Post DONE")
});

app.get('/spending', async function (req, res) {
    let m = new MongoDataAccess();
    let result = await m.findOne(req.body['id']);
    res.statusCode = 200;
    res.json(result);
});

app.use('/trip', tripRouter);
app.use('/participant', participantRouter);


const server = app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
