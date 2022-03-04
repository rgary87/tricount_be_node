const MongoDataAccess = require('../MongoDataAccess');
const express = require('express')
const Distribution = require("../distribution");
const router = express.Router();

router.get('/', async function (req, res) {
    console.log("GET on " + "trip" + " with body: " + req.body);
    const mda = MongoDataAccess.getInstance();
    const result = await mda.findOne("trip", req.body['id']);
    res.statusCode = 200;
    res.json(result);
    console.log("DONE on " + "trip");
});

router.post('/',async function (req, res) {
    console.log("POST on " + "trip" + " with body: " + req.body);
    const mda = MongoDataAccess.getInstance();
    const result = await mda.insert("trip", req.body);
    res.statusCode = 200;
    res.json({id: result});
    console.log("DONE on " + "trip");
});


router.post('/calculation',async function (req, res) {
    console.log("POST on " + "trip/calculation" + " with body: " + req.body);
    const trip = req.body;
    // console.log("Request is: %o", trip);
    Distribution.getAmountPerParticipant(trip);
    // console.log("After got Amount is: %o", trip);
    Distribution.distributeTrip(trip);
    console.log("After Distribution is: %o", trip);
    Distribution.checkForRefunds(trip);
    console.log("After Refunds is: %o", trip);
    res.statusCode = 200;
    res.json(trip);
    console.log("DONE on " + "trip/calculation");
});

router.post('/addRefund', async function (req, res) {
    console.log("POST on " + "trip/addRefund" + " with body: " + req.body);
    const trip = req.body;
    Distribution.checkForRefunds(trip);
    res.statusCode = 200;
    res.json(trip);
    console.log("DONE on " + "trip/addRefund");
});

router.delete('/',async function (req, res) {
    console.log("DELETE on " + "trip");
    const mda = MongoDataAccess.getInstance();
    const result = await mda.delete("trip", req.body['id']);
    res.statusCode = 200;
    res.json({removed:result});
    console.log("DONE on " + "trip");
});

module.exports = {tripRouter: router};
