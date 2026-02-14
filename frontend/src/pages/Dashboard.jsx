import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Activity, Clock, Plus, ChevronRight, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';

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

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-[var(--neon-blue)] rounded-full animate-spin shadow-[0_0_20px_var(--neon-blue)]"></div>
        </div>
    );

    const pieData = [
        { name: 'High Risk', value: stats.highRisk, color: '#ef4444' }, // Red-500
        { name: 'Medium Risk', value: stats.mediumRisk, color: '#f59e0b' }, // Amber-500
        { name: 'Low Risk', value: stats.lowRisk, color: '#10b981' }, // Emerald-500
    ].filter(d => d.value > 0);

    const barData = [
        { name: 'Emergency', users: stats.emergencyQueue },
        { name: 'Priority', users: stats.priorityQueue },
        { name: 'Normal', users: stats.normalQueue },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Hero Section */}
            <header className="flex flex-col md:flex-row justify-between items-end md:items-center pb-6 border-b border-white/5 relative">
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold text-white font-display mb-2 tracking-tight drop-shadow-lg">
                        Command Center <span className="text-[var(--neon-blue)] text-6xl">.</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Live AI-Assisted Triage Operations</p>
                </div>

                {/* Decorative glow */}
                <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/triage')}
                    className="mt-4 md:mt-0 btn-primary flex items-center group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Zap className="mr-2 fill-current" size={20} />
                    Initiate Triage
                    <ChevronRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Patients" value={stats.total} icon={Users} color="border-blue-500" delay={0.1} />
                <StatCard title="High Risk" value={stats.highRisk} icon={AlertTriangle} color="border-red-500" delay={0.2} />
                <StatCard title="Medium Risk" value={stats.mediumRisk} icon={Activity} color="border-yellow-500" delay={0.3} />
                <StatCard title="Low Risk" value={stats.lowRisk} icon={Clock} color="border-green-500" delay={0.4} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-panel p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-purple-600/5 blur-[80px] rounded-full pointer-events-none"></div>

                    <h3 className="text-xl font-bold mb-6 text-white font-display flex items-center relative z-10">
                        <span className="w-1.5 h-8 bg-[var(--neon-purple)] rounded-full mr-3 shadow-[0_0_10px_var(--neon-purple)]"></span>
                        Risk Distribution
                    </h3>
                    <div className="h-80 relative z-10" style={{ width: '100%', height: 320 }}>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%" cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 10px ${entry.color}80)` }} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                <Activity size={32} className="mb-2 opacity-50" />
                                <span>No data available yet</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Queue Status */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="glass-panel p-8 relative overflow-hidden"
                >
                    <div className="absolute bottom-0 left-0 p-32 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none"></div>

                    <h3 className="text-xl font-bold mb-6 text-white font-display flex items-center relative z-10">
                        <span className="w-1.5 h-8 bg-[var(--neon-blue)] rounded-full mr-3 shadow-[0_0_10px_var(--neon-blue)]"></span>
                        Live Queue Status
                    </h3>
                    <div className="h-80 relative z-10" style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} style={{ fontSize: '0.8rem', fontWeight: 600 }} />
                                <YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} dx={-10} style={{ fontSize: '0.8rem' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                />
                                <Bar dataKey="users" radius={[8, 8, 0, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#3b82f6'}
                                            style={{ filter: `drop-shadow(0 0 8px ${index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#3b82f6'}80)` }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
