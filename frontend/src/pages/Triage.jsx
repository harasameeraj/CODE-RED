import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, User, Activity, Thermometer, Heart, Stethoscope, ChevronRight, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const Triage = () => {
    const navigate = useNavigate();
    const [extracting, setExtracting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        symptoms: '',
        bp: '',
        heartRate: '',
        temperature: '',
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
            console.log("Extracted Data:", extracted); // DEBUG
            alert("Data extracted successfully! Please review the fields.");
        } catch (error) {
            console.error("Extraction error:", error);
            alert("Failed to extract data from PDF.");
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
            // Simulate AI thinking time for effect
            await new Promise(r => setTimeout(r, 1500));
            navigate('/result', { state: { result: res.data, patientData: formData } });
        } catch (error) {
            console.error("Error analyzing patient:", error);
            alert("Failed to analyze patient. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto pb-10"
        >
            <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="flex items-center mb-10 border-b border-white/5 pb-6 relative z-10">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mr-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        <FileText size={32} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white font-display tracking-tight">New Patient Intake</h2>
                        <p className="text-blue-200/60 mt-1">AI-Assisted Diagnostic Triage Protocol</p>
                    </div>
                    <div className="ml-auto">
                        <label className={`cursor-pointer flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg border border-blue-500/30 transition-all ${extracting ? 'opacity-50 pointer-events-none' : ''}`}>
                            {extracting ? <Loader2 size={18} className="animate-spin mr-2" /> : <UploadCloud size={18} className="mr-2" />}
                            <span className="text-sm font-semibold">{extracting ? 'Extracting...' : 'Upload Medical Report'}</span>
                            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    {/* Section 1: Demographics */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-sm font-bold text-[var(--neon-blue)] w-fit mb-5 flex items-center uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                            <User size={14} className="mr-2" /> Demographics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide">Patient Name / ID</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full glass-input" placeholder="e.g. John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide">Age</label>
                                    <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full glass-input" placeholder="Yrs" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide">Gender</label>
                                    <div className="relative">
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full glass-input appearance-none bg-slate-900/50">
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                                            <ChevronRight size={16} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Section 2: Clinical Data */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-sm font-bold text-[var(--neon-purple)] w-fit mb-5 flex items-center uppercase tracking-widest px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20 shadow-[0_0_10px_rgba(189,0,255,0.2)]">
                            <Activity size={14} className="mr-2" /> Vitals
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide flex items-center"><Activity size={14} className="mr-2 text-red-500" /> Blood Pressure</label>
                                <input type="text" name="bp" value={formData.bp} onChange={handleChange} className="w-full glass-input" placeholder="120/80" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide flex items-center"><Heart size={14} className="mr-2 text-pink-500" /> Heart Rate</label>
                                <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} className="w-full glass-input" placeholder="BPM" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide flex items-center"><Thermometer size={14} className="mr-2 text-yellow-500" /> Temp (°F)</label>
                                <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full glass-input" placeholder="98.6" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Section 3: Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-sm font-bold text-[var(--neon-pink)] w-fit mb-5 flex items-center uppercase tracking-widest px-3 py-1 bg-pink-500/10 rounded-full border border-pink-500/20 shadow-[0_0_10px_rgba(255,0,85,0.2)]">
                            <Stethoscope size={14} className="mr-2" /> Clinical Observations
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide">Presenting Symptoms</label>
                                <textarea required name="symptoms" value={formData.symptoms} onChange={handleChange} rows="3" className="w-full glass-input resize-none" placeholder="Describe main complaints..."></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide">Medical History / Risk Factors</label>
                                <textarea name="history" value={formData.history} onChange={handleChange} rows="2" className="w-full glass-input resize-none" placeholder="Relevant past history..."></textarea>
                            </div>
                        </div>
                    </motion.div>

                    <div className="pt-8 border-t border-white/5 flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="w-full md:w-auto btn-primary flex justify-center items-center text-lg shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Analyzing Clinical Data...
                                </>
                            ) : (
                                <>
                                    <Activity className="mr-2" />
                                    Run AI Analysis
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default Triage;
