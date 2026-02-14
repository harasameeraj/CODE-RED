import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertOctagon, ArrowRight, Save } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    if (!state) return <div className="text-center p-10">No result data available.</div>;

    const { result, patientData } = state;

    const handleSave = async () => {
        setSaving(true);
        try {
            const caseData = { ...patientData, ...result };
            await axios.post('http://localhost:3000/api/save_case', caseData);
            navigate('/patients');
        } catch (error) {
            console.error("Error saving case:", error);
            alert("Failed to save case.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Triage Analysis Result</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Result Card */}
                <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg border-l-8 border-blue-500">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-slate-500 uppercase text-sm font-semibold tracking-wide">Recommended Department</p>
                            <h1 className="text-4xl font-bold text-slate-900 mt-2">{result.department}</h1>
                        </div>
                        <div className="text-right">
                            <RiskBadge level={result.risk_level} />
                            <p className="text-sm text-slate-500 mt-2">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase">Priority Queue</p>
                            <p className="text-xl font-semibold text-slate-800">{result.priority}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase">Est. Wait Time</p>
                            <p className="text-xl font-semibold text-slate-800">{result.wait_time}</p>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <h4 className="font-semibold text-slate-700 mb-2">Explanation Factors</h4>
                        <ul className="space-y-2">
                            {result.explanations.map((exp, i) => (
                                <li key={i} className="flex items-start text-slate-600">
                                    <AlertOctagon size={16} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                                    <span>{exp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Patient Summary Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                    <h3 className="font-semibold text-slate-700 mb-4 border-b pb-2">Patient Summary</h3>
                    <div className="space-y-3 text-sm">
                        <p><span className="text-slate-400">Name:</span> <span className="font-medium text-slate-800 block">{patientData.name}</span></p>
                        <p><span className="text-slate-400">Age/Gender:</span> <span className="font-medium text-slate-800 block">{patientData.age} / {patientData.gender}</span></p>
                        <p><span className="text-slate-400">Symptoms:</span> <span className="font-medium text-slate-800 block">{patientData.symptoms}</span></p>
                        <p><span className="text-slate-400">Vitals:</span> <span className="font-medium text-slate-800 block">BP: {patientData.bp || 'N/A'}, HR: {patientData.heartRate || 'N/A'}</span></p>
                    </div>

                    <div className="mt-8 space-y-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold flex justify-center items-center transition"
                        >
                            <Save size={18} className="mr-2" />
                            {saving ? 'Saving...' : 'Save Case'}
                        </button>
                        <button
                            onClick={() => navigate('/triage')}
                            className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded-lg font-semibold transition"
                        >
                            Discard & New Triage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
