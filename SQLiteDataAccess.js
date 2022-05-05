const sqlite = require('./aa-sqlite3');

class SQLiteDataAccess {

    static _instance = undefined;
    static path;

    constructor() {
        if (process.env.NODE_ENV === 'production') {
            SQLiteDataAccess.path = '/db/db.db';
        } else {
            SQLiteDataAccess.path = './db.db';
        }
        sqlite.open(SQLiteDataAccess.path);
        this.createTable();
    }

    async createTable() {
        try {
            await sqlite.run('CREATE TABLE trips (uuid VARCHAR(40), data TEXT)', []);
        } catch (e) {
            console.log("%o", e)
            try {
                await sqlite.run('CREATE INDEX uuid_idx ON trips (uuid)', []);
            } catch (f) {
                console.log("%o", f)
            }
        }
    }

    static getInstance() {
        if (SQLiteDataAccess._instance === undefined) {
            SQLiteDataAccess._instance = new SQLiteDataAccess();
        }
        return SQLiteDataAccess._instance;
    }

    async delete(uuid) {
        return await sqlite.run('DELETE FROM trips WHERE uuid = ?', uuid);
    }

    async deleteAll() {
        return await sqlite.run('DELETE FROM trips WHERE uuid != ""', []);
    }

    async findOneTrip(uuid) {
        try {
            let value = await sqlite.get('SELECT data FROM trips WHERE uuid = ?', uuid);
            return JSON.parse(value.data);
        } catch (e) {
            return null;
        }
    }

    async findAll() {
        return await sqlite.all('SELECT * FROM trips', []);
    }

    async insert(o) {
        let res = await sqlite.run('INSERT INTO trips(uuid, data) VALUES (?, ?)', [o.uuid, JSON.stringify(o)]);
        return res;
    }

    async updateTrip(o) {
        return await sqlite.run('UPDATE trips SET data = ? WHERE uuid = ?', [JSON.stringify(o), o.uuid]);
    }



}

module.exports = SQLiteDataAccess;
