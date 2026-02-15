import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, UploadCloud, Activity, Heart, Thermometer, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Triage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [extracting, setExtracting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        symptoms: '',
        bp: '',
        heartRate: 75,
        temperature: 98.6,
        history: ''
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        setExtracting(true);
        try {
            const res = await axios.post('http://localhost:3000/api/extract_from_pdf', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const extracted = res.data;
            setFormData(prev => ({
                ...prev,
                name: extracted.name !== "Unknown" ? extracted.name : prev.name,
                age: extracted.age || prev.age,
                gender: extracted.gender || prev.gender,
                symptoms: extracted.symptoms || prev.symptoms,
                bp: extracted.bp || prev.bp,
                heartRate: extracted.heartRate || prev.heartRate,
                temperature: extracted.temperature || prev.temperature,
                history: extracted.history || prev.history
            }));
            alert("Data extracted successfully!");
        } catch (error) {
            console.error("Extraction error:", error);
            alert("Failed to extract data.");
        } finally {
            setExtracting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/analyze_patient', formData);
            await new Promise(r => setTimeout(r, 1500));
            navigate('/result', { state: { result: res.data, patientData: formData } });
        } catch (error) {
            console.error("Error analyzing patient:", error);
            alert("Failed to analyze patient.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Patient Registration */}
                <div className="card-base p-8">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center">
                            <FileText className="mr-2 text-brand-600" size={24} />
                            {t('new_triage', 'Patient Registration')}
                        </h2>
                        <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 bg-brand-50 text-brand-700 rounded-md text-sm font-medium hover:bg-brand-100 transition-colors ${extracting ? 'opacity-50' : ''}`}>
                            {extracting ? <Loader2 size={14} className="animate-spin mr-2" /> : <UploadCloud size={14} className="mr-2" />}
                            {extracting ? 'Extracting...' : 'Import EMR/PDF'}
                            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="input-label">{t('full_name', 'Patient Details')}</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field mb-3" placeholder="Full Name" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" placeholder="Age" />
                                <div className="relative">
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-field appearance-none">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-3 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">{t('clinical_notes', 'Clinical Notes')}</label>
                            <textarea required name="symptoms" value={formData.symptoms} onChange={handleChange} rows="4" className="input-field mb-4" placeholder="Presenting symptoms..."></textarea>
                            <textarea name="history" value={formData.history} onChange={handleChange} rows="3" className="input-field" placeholder="Medical history..."></textarea>
                        </div>
                    </div>
                </div>

                {/* Right Column: Vital Signs */}
                <div className="card-base p-8 flex flex-col justify-between">
                    <div>
                        <div className="mb-8 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                <Activity className="mr-2 text-brand-600" size={24} />
                                {t('vitals', 'Vital Signs')}
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {/* Heart Rate Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="input-label flex items-center"><Heart size={14} className="mr-1 text-accent-red" /> Heart Rate</label>
                                    <span className="text-sm font-bold text-slate-700">{formData.heartRate} bpm</span>
                                </div>
                                <input
                                    type="range" min="40" max="180" name="heartRate"
                                    value={formData.heartRate} onChange={handleChange}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-red"
                                />
                            </div>

                            {/* BP Input */}
                            <div>
                                <label className="input-label flex items-center"><Activity size={14} className="mr-1 text-brand-600" /> Blood Pressure</label>
                                <input type="text" name="bp" value={formData.bp} onChange={handleChange} className="input-field text-center font-mono text-lg tracking-wider" placeholder="120/80" />
                                <p className="text-xs text-slate-400 text-center mt-1">mmHg</p>
                            </div>

                            {/* Temperature Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="input-label flex items-center"><Thermometer size={14} className="mr-1 text-amber-500" /> Temperature</label>
                                    <span className="text-sm font-bold text-slate-700">{formData.temperature} °F</span>
                                </div>
                                <input
                                    type="range" min="95" max="105" step="0.1" name="temperature"
                                    value={formData.temperature} onChange={handleChange}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full btn-primary py-4 text-base shadow-lg shadow-slate-200"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Processing Assessment...
                                </>
                            ) : (
                                'Generate Triage Assessment'
                            )}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Triage;
