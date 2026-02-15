import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ChevronRight } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { useTranslation } from 'react-i18next';

const Records = () => {
    const { t } = useTranslation();
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/patients');
                setPatients(res.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.department?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('patient_records', 'Patient Records')}</h1>
                <p className="text-slate-500 dark:text-slate-400">Search and manage clinical history.</p>
            </div>

            <div className="card-base overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center transition-colors">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('search_placeholder', 'Search by name or department...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                                <th className="px-6 py-4">Patient Name</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Risk Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredPatients.length > 0 ? filteredPatients.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 text-xs font-bold mr-3">
                                                {p.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-white">{p.name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-500">{p.age} yrs • {p.gender}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {p.date ? new Date(p.date).toLocaleDateString() : 'Today'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{p.department || 'General Practice'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{p.priority || 'Normal'}</td>
                                    <td className="px-6 py-4">
                                        <RiskBadge level={p.risk_level || 'Low'} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-200 p-2 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-full transition-colors">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No records found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Records;
