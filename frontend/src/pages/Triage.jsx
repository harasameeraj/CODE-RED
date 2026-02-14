import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileText, Save, Loader2 } from 'lucide-react';

const Triage = () => {
    const navigate = useNavigate();
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/analyze_patient', formData);
            navigate('/result', { state: { result: res.data, patientData: formData } });
        } catch (error) {
            console.error("Error analyzing patient:", error);
            alert("Failed to analyze patient. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
                <FileText className="mr-2 text-blue-600" />
                New Patient Triage
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name/ID</label>
                        <input required type="text" name="name" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                            <input required type="number" name="age" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Age" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select name="gender" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms</label>
                    <textarea required name="symptoms" onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe symptoms (e.g. Chest pain, fever)..."></textarea>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Blood Pressure</label>
                        <input type="text" name="bp" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="120/80" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Heart Rate</label>
                        <input type="number" name="heartRate" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="BPM" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Temp (°F)</label>
                        <input type="number" step="0.1" name="temperature" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="98.6" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Medical History</label>
                    <textarea name="history" onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Relevant history..."></textarea>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <p className="text-sm text-slate-500 mb-2">Detailed Reports (Optional)</p>
                    <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:scale-[1.01] flex justify-center items-center"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                    Analyze Patient
                </button>
            </form>
        </div>
    );
};

export default Triage;
