const { getDbInstance, isEmpty } = require("../helpers")

const hour = 4000;
const ceil = true

const db = getDbInstance()
const orm = {};

function getTodayRecords() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    const isoDateString = localISOTime.slice(0, 10);

    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM records WHERE date_added LIKE ? ORDER BY date_added DESC", [isoDateString + "%"], (err, rows) => {
            if(err) console.error(err);

            resolve(rows)
        });
    })
}

function getSpecificDayRecords(date) {
    const day = new Date(date);
    const isoDateString = day.toISOString().slice(0, 10);

    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM records WHERE date_added LIKE ? ORDER BY date_added DESC", [isoDateString + "%"], (err, rows) => {
            if(err) console.error(err);
            resolve(rows)
        });
    })
}

function getSpecificMonthRecords(date) {
    const day = new Date(date);
    const isoDateString = day.toISOString().slice(0, 7);

    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM records WHERE date_added LIKE ? ORDER BY date_added DESC", [isoDateString + "%"], (err, rows) => {
            if(err) console.error(err);
            resolve(rows)
        });
    })
}

function insertRecord({ title, amount, date_added }) {
    db.run("INSERT INTO records (title, amount, date_added) VALUES (?,?,?)", [title, amount, date_added], (err) => {
        if(err) console.error(err);
    })
}

function deleteRecord(id) {
    db.run("DELETE FROM records WHERE id = ?", [id], (err) => {
        if(err) console.error(err);
    })
}

function getSettings() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM settings", async (err, rows) => {
            if(rows.length > 0) {
                resolve(rows);
            } else {
                await db.run("INSERT INTO settings (key, value) VALUES (?, ?), (?, ?)", ["hour", hour, "ceil", ceil], (err) => {
                    if(err) console.error(err)
                })
                db.all("SELECT * FROM settings", async (err, rows) => {
                    resolve(rows)
                })
            }
        });
    })
}

function changeSettings({ hour, ceil }) {
    db.run("UPDATE settings set value=? WHERE key='hour'", [hour], (err) => {
        if(err) console.error(err)
    })
    db.run("UPDATE settings set value=? WHERE key='ceil'", [ceil], (err) => {
        if(err) console.error(err)
    })
}

module.exports = {
    getTodayRecords,
    getSpecificDayRecords,
    getSpecificMonthRecords,
    insertRecord,
    deleteRecord,
    getSettings,
    changeSettings
};