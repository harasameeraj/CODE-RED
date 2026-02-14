import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertOctagon, ArrowRight, Save, RotateCcw, Activity, Siren, User } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { motion } from 'framer-motion';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    if (!state) return <div className="text-center p-10 text-white">No result data available.</div>;

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

    // Determine color theme based on risk
    const themeColor = result.risk_level === 'High' ? 'red' :
        result.risk_level === 'Medium' ? 'yellow' : 'green';

    // Pulse animation for high risk
    const isHighRisk = result.risk_level === 'High';

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h2 className="text-4xl font-bold text-white font-display tracking-tight flex items-center">
                        {isHighRisk && <Siren className="mr-3 text-red-500 animate-pulse" />}
                        Analysis Complete
                    </h2>
                    <p className="text-slate-400 mt-1">AI Confidence Score: <span className="text-[var(--neon-blue)] font-bold">{(result.confidence * 100).toFixed(1)}%</span></p>
                </div>
                <div className="flex space-x-4">
                    <button onClick={() => navigate('/triage')} className="btn-secondary flex items-center">
                        <RotateCcw size={18} className="mr-2" /> New Triage
                    </button>
                    <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Record'}
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Result Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`md:col-span-2 glass-panel p-10 relative overflow-hidden flex flex-col justify-between min-h-[400px] border-t-8`}
                    style={{
                        borderColor: result.risk_level === 'High' ? '#ef4444' : result.risk_level === 'Medium' ? '#f59e0b' : '#10b981',
                        boxShadow: isHighRisk ? '0 0 50px rgba(239,68,68,0.2)' : ''
                    }}
                >
                    {/* Background Glow */}
                    <div
                        className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20`}
                        style={{ backgroundColor: result.risk_level === 'High' ? '#ef4444' : result.risk_level === 'Medium' ? '#f59e0b' : '#10b981' }}
                    ></div>

                    <div className="relative z-10 w-full">
                        <div className="flex justify-between items-start mb-10 w-full">
                            <div>
                                <p className="text-slate-400 uppercase text-xs font-bold tracking-[0.2em] mb-3">Recommended Department</p>
                                <h1 className="text-6xl font-black text-white font-display tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                    {result.department}
                                </h1>
                            </div>
                            <div className="scale-125 origin-top-right">
                                <RiskBadge level={result.risk_level} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-slate-900/40 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Priority Level</p>
                                <p className={`text-3xl font-bold mt-2`} style={{ color: result.risk_level === 'High' ? '#ef4444' : result.risk_level === 'Medium' ? '#f59e0b' : '#3b82f6' }}>
                                    {result.priority}
                                </p>
                            </div>
                            <div className="bg-slate-900/40 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Wait Time</p>
                                <p className="text-3xl font-bold mt-2 text-white">{result.wait_time}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 relative z-10">
                        <h4 className="font-bold text-white mb-6 flex items-center uppercase text-sm tracking-widest">
                            <Activity size={18} className="mr-3 text-[var(--neon-blue)]" />
                            AI Diagnostic Factors
                        </h4>
                        <ul className="space-y-4">
                            {result.explanations.map((exp, i) => (
                                <motion.li
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    key={i}
                                    className="flex items-start group"
                                >
                                    <div className={`mt-1.5 mr-4 p-1 rounded-full`} style={{ backgroundColor: isHighRisk ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)' }}>
                                        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: isHighRisk ? '#ef4444' : '#3b82f6' }}></div>
                                    </div>
                                    <span className="text-lg text-slate-300 leading-relaxed group-hover:text-white transition-colors">{exp}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Patient Summary Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-8 h-fit border-l-4 border-slate-700"
                >
                    <h3 className="font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center uppercase text-sm tracking-widest">
                        <User size={18} className="mr-3 text-[var(--neon-purple)]" />
                        Patient Profile
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Name / ID</span>
                            <span className="font-bold text-white text-xl">{patientData.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Age</span>
                                <span className="font-medium text-white text-lg">{patientData.age} <span className="text-sm text-slate-600">Yrs</span></span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Gender</span>
                                <span className="font-medium text-white text-lg">{patientData.gender}</span>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 shadow-inner">
                            <span className="text-slate-500 block text-xs uppercase font-bold mb-3">Vitals Snapshot</span>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-slate-400 text-sm">BP</span>
                                    <span className="text-white font-mono font-bold">{patientData.bp || '--'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-slate-400 text-sm">Heart Rate</span>
                                    <span className="text-white font-mono font-bold">{patientData.heartRate || '--'} <span className="text-xs text-slate-600">BPM</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Temp</span>
                                    <span className="text-white font-mono font-bold">{patientData.temperature || '--'} <span className="text-xs text-slate-600">°F</span></span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-500 block text-xs uppercase font-bold mb-2">Reported Symptoms</span>
                            <p className="text-slate-300 italic leading-relaxed border-l-2 border-white/10 pl-4 py-1">"{patientData.symptoms}"</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Result;
