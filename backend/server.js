const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('./database'); // Import SQLite connection

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// POST /analyze_patient
app.post('/api/analyze_patient', (req, res) => {
    const { age, symptoms, bp, heartRate, temperature } = req.body;
    const { spawn } = require('child_process');

    const pythonProcess = spawn('python3', ['./model/predict.py']);

    let resultString = '';
    let errorString = '';

    // Send data to python script
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
        resultString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            console.error('Python Error:', errorString);
            // Fallback to mock if python fails
            return res.json(getMockAnalysis(req.body));
        }

        try {
            const result = JSON.parse(resultString);
            if (result.error) {
                console.warn("Model warning:", result.error);
                // Merge fallback data if model returns limited info
                const fallback = getMockAnalysis(req.body);
                return res.json({ ...fallback, ...result, explanations: [...fallback.explanations, ...(result.explanations || [])] });
            }
            res.json(result);
        } catch (e) {
            console.error("Failed to parse Python output:", resultString);
            res.json(getMockAnalysis(req.body));
        }
    }); // Closes pythonProcess.on
}); // Closes app.post

// POST /extract_from_pdf
app.post('/api/extract_from_pdf', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python3', ['./model/extract.py', filePath]);

    let resultString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        resultString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        // Clean up uploaded file
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });

        if (code !== 0) {
            console.error('Extraction script error:', errorString);
            return res.status(500).json({ error: 'Extraction failed: ' + errorString });
        }

        try {
            const result = JSON.parse(resultString);
            if (result.error) {
                return res.status(500).json({ error: result.error });
            }
            res.json(result);
        } catch (e) {
            console.error("Failed to parse extraction output:", resultString);
            res.status(500).json({ error: 'Failed to parse extraction result' });
        }
    });
});

// Fallback Mock Logic (moved to function)
function getMockAnalysis(data) {
    const { symptoms, bp, heartRate, temperature } = data;
    let risk_level = 'Low';
    let department = 'General Practice';
    let priority = 'Normal';
    let wait_time = '30 minutes';
    let confidence = 0.75 + Math.random() * 0.2;
    let explanations = [];

    const sysBP = bp ? parseInt(bp.split('/')[0]) : 120;
    const temp = temperature ? parseFloat(temperature) : 98.6;
    const hr = heartRate ? parseInt(heartRate) : 70;

    if (symptoms && (symptoms.toLowerCase().includes('chest pain') || symptoms.toLowerCase().includes('shortness of breath'))) {
        risk_level = 'High';
        department = 'Cardiology';
        priority = 'Emergency';
        wait_time = '5 minutes';
        explanations.push('High-risk symptoms detected (Chest pain/breathlessness).');
    } else if (sysBP > 160 || hr > 110 || temp > 103) {
        risk_level = 'High';
        department = 'Emergency';
        priority = 'Emergency';
        wait_time = '10 minutes';
        explanations.push('Vital signs indicate immediate attention needed.');
    } else if (sysBP > 140 || temp > 101) {
        risk_level = 'Medium';
        department = 'Internal Medicine';
        priority = 'Priority';
        wait_time = '45 minutes';
        explanations.push('Elevated vitals detected.');
    }

    if (explanations.length === 0) {
        explanations.push('Routine checkup based on reported symptoms.');
    }

    return {
        risk_level,
        department,
        priority,
        wait_time,
        confidence: parseFloat(confidence.toFixed(2)),
        explanations
    };
}

// POST /save_case
app.post('/api/save_case', (req, res) => {
    const newCase = req.body;
    newCase.id = Date.now().toString(); // Simple ID
    newCase.date = new Date().toISOString();

    const stmt = db.prepare(`INSERT INTO patients (
        id, name, age, gender, symptoms, bp, heartRate, temperature, 
        history, risk_level, department, priority, wait_time, confidence, explanations, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const explanations = Array.isArray(newCase.explanations) ? JSON.stringify(newCase.explanations) : newCase.explanations;

    stmt.run(
        newCase.id, newCase.name, newCase.age, newCase.gender, newCase.symptoms,
        newCase.bp, newCase.heartRate, newCase.temperature, newCase.history,
        newCase.risk_level, newCase.department, newCase.priority,
        newCase.wait_time, newCase.confidence, explanations, newCase.date,
        function (err) {
            if (err) {
                console.error("Error saving case:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true, id: newCase.id });
        }
    );
    stmt.finalize();
});

// GET /dashboard_stats
app.get('/api/dashboard_stats', (req, res) => {
    db.all("SELECT * FROM patients", [], (err, rows) => {
        if (err) {
            console.error("Error fetching stats:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const patients = rows;
        const stats = {
            total: patients.length,
            highRisk: patients.filter(p => p.risk_level === 'High').length,
            mediumRisk: patients.filter(p => p.risk_level === 'Medium').length,
            lowRisk: patients.filter(p => p.risk_level === 'Low').length,
            emergencyQueue: patients.filter(p => p.priority === 'Emergency').length,
            priorityQueue: patients.filter(p => p.priority === 'Priority').length,
            normalQueue: patients.filter(p => p.priority === 'Normal').length
        };

        res.json(stats);
    });
});

// GET /patients
app.get('/api/patients', (req, res) => {
    db.all("SELECT * FROM patients ORDER BY date DESC", [], (err, rows) => {
        if (err) {
            console.error("Error fetching patients:", err);
            return res.status(500).json({ error: "Database error" });
        }

        // Parse explanations back to array
        const patients = rows.map(p => ({
            ...p,
            explanations: p.explanations ? JSON.parse(p.explanations) : []
        }));

        res.json(patients);
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
