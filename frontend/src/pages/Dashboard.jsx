import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Activity, Clock, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import StatCard from '../components/StatCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/dashboard_stats');
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                // Mock fallback for UI dev if backend unreachable
                setStats({
                    total: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0,
                    emergencyQueue: 0, priorityQueue: 0, normalQueue: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    const pieData = [
        { name: 'High Risk', value: stats.highRisk, color: '#EF4444' },
        { name: 'Medium Risk', value: stats.mediumRisk, color: '#F59E0B' },
        { name: 'Low Risk', value: stats.lowRisk, color: '#10B981' },
    ].filter(d => d.value > 0);

    const barData = [
        { name: 'Emergency', users: stats.emergencyQueue },
        { name: 'Priority', users: stats.priorityQueue },
        { name: 'Normal', users: stats.normalQueue },
    ];

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Triage Dashboard</h1>
                    <p className="text-slate-500">Real-time hospital overview</p>
                </div>
                <button
                    onClick={() => navigate('/triage')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center shadow-lg transition transform hover:scale-105"
                >
                    <Plus className="mr-2" />
                    Start New Triage
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Patients" value={stats.total} icon={Users} color="border-blue-500" />
                <StatCard title="High Risk" value={stats.highRisk} icon={AlertTriangle} color="border-red-500" />
                <StatCard title="Medium Risk" value={stats.mediumRisk} icon={Activity} color="border-yellow-500" />
                <StatCard title="Low Risk" value={stats.lowRisk} icon={Clock} color="border-green-500" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-slate-700">Risk Distribution</h3>
                    <div className="h-64">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-slate-700">Queue Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
