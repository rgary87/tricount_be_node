const SQLiteDataAccess = require('../SQLiteDataAccess');
const express = require('express')
const router = express.Router();

router.get('/', async function (req, res) {
    console.log("GET on " + "participant" + " with body: " + req.body);
    const mda = SQLiteDataAccess.getInstance();
    const result = await mda.findOne("participant", req.body['id']);
    res.statusCode = 200;
    res.json(result);
    console.log("DONE on " + "participant");
});

router.get('/all', async function (req, res) {
    console.log("GET on " + "participant/all" + " with body: " + req.body);
    const mda = SQLiteDataAccess.getInstance();
    const result = await mda.findAll("participant");
    res.statusCode = 200;
    res.json(result);
    console.log("DONE on " + "participant/all");
});

router.post('/',async function (req, res) {
    console.log("POST on " + "participant / " + " with body: " + req.body);
    const mda = SQLiteDataAccess.getInstance();
    const result = await mda.insert("participant", req.body)
    res.statusCode = 200;
    res.json({id: result});
    console.log("DONE on " + "participant");
});

router.post('/trip/:tripId/add',async function (req, res) {
    console.log("POST on " + "participant trip add" + " with body: " + req.body);
    const mda = SQLiteDataAccess.getInstance();
    let participant = req.body;
    participant['trip_id'] = req.params['tripId'];
    const result = await mda.insert("participant", req.body);
    res.statusCode = 200;
    res.json({id: result});
    console.log("DONE on " + "participant");
});

router.delete('/',async function (req, res) {
    console.log("DELETE on " + "participant");
    const mda = SQLiteDataAccess.getInstance();
    const result = await mda.delete("participant", req.body['id']);
    res.statusCode = 200;
    res.json({removed:result});
    console.log("DONE on " + "participant");
});

router.delete('/all',async function (req, res) {
    console.log("DELETE on " + "participant");
    const mda = SQLiteDataAccess.getInstance();
    const result = await mda.deleteAll();
    res.statusCode = 200;
    res.json({removed:result});
    console.log("DONE on " + "participant");
});

module.exports = {participantRouter: router};
