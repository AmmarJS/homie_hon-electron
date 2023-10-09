const fs = require('fs');
const { app } = require("electron");

function view(viewName) {
    return __dirname + '/views/' + viewName
}

function getDbInstance() {
    if(!fs.existsSync("database.db")) {
        fs.writeFileSync("database.db", "")
    }
    const sqlite3 = require('sqlite3').verbose();
    let query = "";
    const db = new sqlite3.Database("database.db", sqlite3.OPEN_READWRITE, (err) => {
        if(err) console.error(err);
    });
    
    db.run("CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, amount INTEGER, date_added TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT)")

    return db;
}

function isEmpty(object) {
    if(Object.keys(object).length === 0 && object.constructor === Object) return true;

    return false;
}

module.exports = {
    view,
    getDbInstance,
    isEmpty
}