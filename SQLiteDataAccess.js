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
    }

    static getInstance() {
        if (SQLiteDataAccess._instance === undefined) {
            SQLiteDataAccess._instance = new SQLiteDataAccess();
            sqlite.open(SQLiteDataAccess.path);
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
        return JSON.parse((await sqlite.get('SELECT data FROM trips WHERE uuid = ?', uuid)).data);
    }

    async findAll() {
        return await sqlite.all('SELECT * FROM trips', []);
    }

    async insert(o) {
        return await sqlite.run('INSERT INTO trips VALUES (?, ?)', [o.uuid, JSON.stringify(o)]);
    }

    async updateTrip(o) {
        return await sqlite.run('UPDATE trips SET data = ? WHERE uuid = ?', [JSON.stringify(o), o.uuid]);
    }

}

module.exports = SQLiteDataAccess;
