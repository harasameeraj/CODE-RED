const fs = require('fs');
const path = require('path');
const db = require('./database');

const DATA_FILE = path.join(__dirname, 'patients.json');

function migrate() {
    if (!fs.existsSync(DATA_FILE)) {
        console.log("No patients.json found. Skipping migration.");
        return;
    }

    const rawData = fs.readFileSync(DATA_FILE);
    let patients = [];
    try {
        const json = JSON.parse(rawData);
        patients = json.patients || [];
    } catch (e) {
        console.error("Error parsing patients.json:", e);
        return;
    }

    if (patients.length === 0) {
        console.log("No patients to migrate.");
        return;
    }

    console.log(`Migrating ${patients.length} patients...`);

    db.serialize(() => {
        const stmt = db.prepare(`INSERT OR IGNORE INTO patients (
            id, name, age, gender, symptoms, bp, heartRate, temperature, 
            history, risk_level, department, priority, wait_time, confidence, explanations, date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        patients.forEach(p => {
            // Handle array for explanations
            const explanations = Array.isArray(p.explanations) ? JSON.stringify(p.explanations) : p.explanations;

            stmt.run(
                p.id, p.name, p.age, p.gender, p.symptoms, p.bp, p.heartRate, p.temperature,
                p.history, p.risk_level, p.department, p.priority, p.wait_time, p.confidence, explanations, p.date
            );
        });

        stmt.finalize(() => {
            console.log("Migration complete.");
            db.close();
        });
    });
}

// Wait for DB connection
setTimeout(migrate, 1000);
