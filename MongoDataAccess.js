const {MongoClient, ObjectId} = require('mongodb');
const {klass: Trip, parseJSONtoTrip} = require('./models/Trip');

class MongoDataAccess {

    static _instance = undefined;

    constructor() {
        this.uri = "mongodb://localhost:27017";
        this.client = new MongoClient(this.uri);
        this.database = this.client.db("tricount");
    }

    static getInstance() {
        if (MongoDataAccess._instance === undefined) {
            let instance = new MongoDataAccess();
            instance.connect();
            MongoDataAccess._instance = instance;
        }
        return MongoDataAccess._instance;
    }

    connect() {
        (async () => {
            await this.client.connect();
        })();
    }

    async close() {
        console.log("Closing connection...");
        await this.client.close();
        console.log("Connection closed.");
    }

    async delete(collectionName, id) {
        const collection = this.database.collection(collectionName);

        const query = {_id: new ObjectId(id)};
        const result = await collection.deleteOne(query);
        console.log("Deleted " + result.deletedCount + " documents");
        return result.deletedCount;
    }

    async deleteAll(collectionName) {
        const collection = this.database.collection(collectionName);

        const result = await collection.deleteMany({});
        console.log("Deleted " + result.deletedCount + " documents");
        return result.deletedCount;

    }

    async findOne(collectionName, id) {
        const collection = this.database.collection(collectionName);

        const query = {_id: new ObjectId(id)};
        const cursor = await collection.find(query);

        let result = await cursor.toArray();

        for (let r of result) {
            console.log("Result is: " + r);
        }
        return result[0];
    }

    async findAll(collectionName) {
        const collection = this.database.collection(collectionName);

        const cursor = await collection.find();

        let allResult = await cursor.toArray();

        for (let r of allResult) {
            console.log("Result is: " + r);
        }
        return allResult;

    }

    async insert(collectionName, o) {
        const collection = this.database.collection(collectionName);

        const result = await collection.insertOne(o);
        console.log("Inserted a document with _id: " + result.insertedId);
        return result.insertedId;
    }

}

module.exports = MongoDataAccess;
