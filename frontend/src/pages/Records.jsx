import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

const Records = () => {
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Patient Records</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold">Patient Name</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Risk Level</th>
                            <th className="px-6 py-4 font-semibold">Department</th>
                            <th className="px-6 py-4 font-semibold">Priority</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPatients.length > 0 ? filteredPatients.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 text-slate-800 font-medium">{p.name || 'Unknown'}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {p.date ? new Date(p.date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <RiskBadge level={p.risk_level} />
                                </td>
                                <td className="px-6 py-4 text-slate-600">{p.department}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    <span className={`inline-block w-2 H-2 rounded-full mr-2 ${p.priority === 'Emergency' ? 'bg-red-500' :
                                            p.priority === 'Priority' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`}></span>
                                    {p.priority}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Records;
