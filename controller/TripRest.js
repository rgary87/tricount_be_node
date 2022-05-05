const SQLiteDataAccess = require('../SQLiteDataAccess');
const express = require('express')
const Distribution = require("../distribution");
const {v4: uuidV4} = require("uuid");
const router = express.Router();

const sda = SQLiteDataAccess.getInstance();

router.get('/:uuid', async function (req, res) {
    const result = await sda.findOneTrip(req.params['uuid']);
    console.log("Get by uuid result: %o", result);
    if (!result) {
        res.statusCode = 404;
        res.json();
    } else {
        res.statusCode = 200;
        res.json(result);
    }
    console.log("DONE on GET " + "trip/" + req.params['uuid']);
});

router.post('/', async function (req, res) {
    console.log("POST on %o with body: %o", req.body);
    const result = await sda.insert(req.body);
    res.statusCode = 200;
    res.json({id: result});
    console.log("DONE on POST" + "trip");
});

router.post('/create', async function (req, res) {
    console.log("POST on %o with body: %o", "trip/create", req.body);
    if (req.body.isInit) {
        const result = sda.insert(req.body);
        console.log("mongo result: %o", result);
    }
    res.statusCode = 200;
    res.json(req.body);
    console.log("DONE on POST " + "trip/create");
});


router.post('/calculation', async function (req, res) {
    console.log("POST on %o with body: %o", "trip/calculation", req.body);
    const trip = req.body;
    // console.log("Request is: %o", trip);
    Distribution.getAmountPerParticipant(trip);
    // console.log("After got Amount is: %o", trip);
    Distribution.distributeTrip(trip);
    // console.log("After Distribution is: %o", trip);
    Distribution.checkForRefunds(trip);
    // console.log("After Refunds is: %o", trip);
    sda.updateTrip('trip', trip.uuid, trip);
    res.statusCode = 200;
    res.json(trip);
    console.log("DONE on POST " + "trip/calculation");
});

router.post('/addRefund', async function (req, res) {
    console.log("POST on " + "trip/addRefund" + " with body: " + req.body);
    const trip = req.body;
    Distribution.checkForRefunds(trip);
    res.statusCode = 200;
    res.json(trip);
    console.log("DONE on " + "trip/addRefund");
});

router.delete('/', async function (req, res) {
    console.log("DELETE on " + "trip");
    const result = await sda.delete(req.body['id']);
    res.statusCode = 200;
    res.json({removed: result});
    console.log("DONE on " + "trip");
});

module.exports = {tripRouter: router};
