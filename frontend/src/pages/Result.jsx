import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertOctagon, ArrowRight, Save, RotateCcw, Activity, Siren, User } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [saving, setSaving] = useState(false);

    if (!state) return <div className="text-center p-10 text-slate-500 dark:text-slate-400">{t('no_result_data')}</div>;

    const { result, patientData } = state;

    const handleSave = async () => {
        setSaving(true);
        try {
            const caseData = { ...patientData, ...result };
            await axios.post('http://localhost:3000/api/save_case', caseData);
            navigate('/patients');
        } catch (error) {
            console.error("Error saving case:", error);
            alert(t('error_save_case'));
        } finally {
            setSaving(false);
        }
    };

    // Determine color theme based on risk
    const getThemeColor = () => {
        if (result.risk_level === 'High') return 'text-red-500';
        if (result.risk_level === 'Medium') return 'text-amber-500';
        return 'text-emerald-500';
    };

    const getBorderColor = () => {
        if (result.risk_level === 'High') return 'border-red-500';
        if (result.risk_level === 'Medium') return 'border-amber-500';
        return 'border-emerald-500';
    };

    const isHighRisk = result.risk_level === 'High';

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10 px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight flex items-center">
                        {isHighRisk && <Siren className="mr-3 text-red-500 animate-pulse" />}
                        {t('analysis_complete')}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('confidence_score')}: <span className="text-brand-600 dark:text-brand-400 font-bold">{(result.confidence * 100).toFixed(1)}%</span></p>
                </div>
                <div className="flex space-x-4">
                    <button onClick={() => navigate('/triage')} className="btn-secondary flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <RotateCcw size={18} className="mr-2" /> {t('new_triage')}
                    </button>
                    <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center">
                        <Save size={18} className="mr-2" /> {saving ? t('saving') : t('save_record')}
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Result Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`md:col-span-2 card-base p-8 relative overflow-hidden flex flex-col justify-between min-h-[400px] border-t-8 ${getBorderColor()}`}
                >
                    {/* Background Glow - only visible in dark mode or very subtle in light */}
                    <div
                        className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-5 dark:opacity-20`}
                        style={{ backgroundColor: result.risk_level === 'High' ? '#ef4444' : result.risk_level === 'Medium' ? '#f59e0b' : '#10b981' }}
                    ></div>

                    <div className="relative z-10 w-full">
                        <div className="flex justify-between items-start mb-10 w-full">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 uppercase text-xs font-bold tracking-[0.2em] mb-3">{t('department')}</p>
                                <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">
                                    {result.department}
                                </h1>
                            </div>
                            <div className="scale-125 origin-top-right">
                                <RiskBadge level={result.risk_level} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl">
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t('priority_level')}</p>
                                <p className={`text-3xl font-bold mt-2 ${getThemeColor()}`}>
                                    {result.priority}
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl">
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t('wait_time')}</p>
                                <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{result.wait_time}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-8 relative z-10">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center uppercase text-sm tracking-widest">
                            <Activity size={18} className="mr-3 text-brand-500" />
                            {t('ai_diagnostic_factors')}
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
                                    <div className={`mt-1.5 mr-4 p-1 rounded-full bg-slate-100 dark:bg-slate-800`}>
                                        <div className={`w-2 h-2 rounded-full ${getThemeColor().replace('text-', 'bg-')}`}></div>
                                    </div>
                                    <span className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{exp}</span>
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
                    className="card-base p-8 h-fit border-l-4 border-slate-500 dark:border-slate-700"
                >
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center uppercase text-sm tracking-widest">
                        <User size={18} className="mr-3 text-brand-500" />
                        {t('patient_profile')}
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <span className="text-slate-500 dark:text-slate-500 block text-xs uppercase font-bold mb-1">{t('patient_id')}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-xl">{patientData.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-slate-500 dark:text-slate-500 block text-xs uppercase font-bold mb-1">{t('age')}</span>
                                <span className="font-medium text-slate-900 dark:text-white text-lg">{patientData.age} <span className="text-sm text-slate-500 dark:text-slate-400">{t('years')}</span></span>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-500 block text-xs uppercase font-bold mb-1">{t('gender')}</span>
                                <span className="font-medium text-slate-900 dark:text-white text-lg">{patientData.gender}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                            <span className="text-slate-500 dark:text-slate-500 block text-xs uppercase font-bold mb-3">{t('vitals_snapshot')}</span>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <span className="text-slate-500 dark:text-slate-400 text-sm">{t('bp')}</span>
                                    <span className="text-slate-900 dark:text-white font-mono font-bold">{patientData.bp || '--'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <span className="text-slate-500 dark:text-slate-400 text-sm">{t('heart_rate')}</span>
                                    <span className="text-slate-900 dark:text-white font-mono font-bold">{patientData.heartRate || '--'} <span className="text-xs text-slate-500 dark:text-slate-500">BPM</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-slate-400 text-sm">{t('temp')}</span>
                                    <span className="text-slate-900 dark:text-white font-mono font-bold">{patientData.temperature || '--'} <span className="text-xs text-slate-500 dark:text-slate-500">°F</span></span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-500 dark:text-slate-500 block text-xs uppercase font-bold mb-2">{t('reported_symptoms')}</span>
                            <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed border-l-2 border-slate-200 dark:border-slate-700 pl-4 py-1">"{patientData.symptoms}"</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Result;
