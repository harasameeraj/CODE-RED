const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'patients.json');

// Helper to read data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return { patients: [] };
    }
    const data = fs.readFileSync(DATA_FILE);
    try {
        return JSON.parse(data);
    } catch (e) {
        return { patients: [] };
    }
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Initialize file if not exists
if (!fs.existsSync(DATA_FILE)) {
    writeData({ patients: [] });
}

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

    const data = readData();
    data.patients.push(newCase);
    writeData(data);

    res.json({ success: true, id: newCase.id });
});

// GET /dashboard_stats
app.get('/api/dashboard_stats', (req, res) => {
    const data = readData();
    const patients = data.patients;

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

// GET /patients
app.get('/api/patients', (req, res) => {
    const data = readData();
    res.json(data.patients);
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
