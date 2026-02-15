import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, AlertTriangle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();
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
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
    );

    // Mock data for Risk Distribution Chart (Vertical Bars)
    const riskData = [
        { name: t('critical'), value: stats.highRisk, color: '#ef4444' },
        { name: t('moderate'), value: stats.mediumRisk, color: '#f59e0b' },
        { name: t('stable'), value: stats.lowRisk, color: '#3b82f6' },
    ];

    // Mock data for Department Distribution
    const departments = [
        { name: t('dept_general_medicine'), count: stats.normalQueue + 2, total: 10 },
        { name: t('dept_cardiology'), count: stats.priorityQueue + 1, total: 5 },
        { name: t('dept_pulmonology'), count: 0, total: 5 },
        { name: t('dept_endocrinology'), count: 0, total: 3 },
        { name: t('emergency'), count: stats.emergencyQueue, total: 8 },
        { name: t('dept_nutrition'), count: 0, total: 2 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('clinical_dashboard')}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t('real_time_overview')}</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* High Risk Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="card-base p-6 flex justify-between items-center relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-red"></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('high_risk_patients')}</p>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{stats.highRisk}</h2>
                    </div>
                    <div className="bg-accent-red/10 p-3 rounded-full text-accent-red dark:bg-accent-red/20">
                        <AlertTriangle size={24} />
                    </div>
                </motion.div>

                {/* Total Patients Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="card-base p-6 flex justify-between items-center relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('total_patients')}</p>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{stats.total}</h2>
                    </div>
                    <div className="bg-brand-50 p-3 rounded-full text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                        <Users size={24} />
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Department Distribution (2/3 width) */}
                <div className="lg:col-span-2 card-base p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                            <Activity size={18} className="mr-2 text-brand-500" />
                            {t('department_distribution')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('dept_distribution_desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {departments.map((dept, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.name}</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{dept.count}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(dept.count / Math.max(dept.total, 1)) * 100}%` }}
                                        className={`h-full rounded-full ${dept.count > 0 ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-600'}`}
                                    />
                                </div>
                                <div className="text-xs text-right text-slate-400 dark:text-slate-500">
                                    {dept.count > 0 ? `${Math.round((dept.count / stats.total) * 100)}% ${t('of_total')}` : `0% ${t('of_total')}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Distribution Chart (1/3 width) */}
                <div className="card-base p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                            <Activity size={18} className="mr-2 text-brand-500" />
                            {t('risk_distribution')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('severity_analysis')}</p>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskData} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" strokeOpacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: '#1e293b',
                                        color: '#f8fafc'
                                    }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-between mt-6 text-center">
                        <div>
                            <p className="text-2xl font-bold text-accent-red">{Math.round((stats.highRisk / Math.max(stats.total, 1)) * 100)}%</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('critical')}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-500">{Math.round((stats.mediumRisk / Math.max(stats.total, 1)) * 100)}%</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('moderate')}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-brand-500">{Math.round((stats.lowRisk / Math.max(stats.total, 1)) * 100)}%</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('stable')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
