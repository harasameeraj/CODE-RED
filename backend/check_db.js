const db = require('./database');

console.log("Fetching data from SQLite...");

db.all("SELECT id, name, risk_level, department FROM patients", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log(`Found ${rows.length} patients in the database:`);
    console.table(rows);
    console.log("\nIf you see this list, your database is working perfectly!");
});
