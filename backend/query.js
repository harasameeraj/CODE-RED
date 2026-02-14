const db = require('./database');

// Get the SQL query from the command line argument
const query = process.argv[2];

if (!query) {
    console.log("Usage: node query.js \"SELECT ...\"");
    console.log("Example: node query.js \"SELECT name, age, risk_level FROM patients WHERE risk_level = 'High'\"");
    process.exit(1);
}

console.log(`Executing SQL: "${query}"`);

db.all(query, [], (err, rows) => {
    if (err) {
        console.error("Error executing query:", err.message);
        return;
    }

    if (rows.length === 0) {
        console.log("No results found.");
    } else {
        console.table(rows);
    }
});
