const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.run(`CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        symptoms TEXT,
        bp TEXT,
        heartRate INTEGER,
        temperature REAL,
        history TEXT,
        risk_level TEXT,
        department TEXT,
        priority TEXT,
        wait_time TEXT,
        confidence REAL,
        explanations TEXT, 
        date TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err);
        } else {
            console.log("Patients table ready.");
        }
    });
}

module.exports = db;
