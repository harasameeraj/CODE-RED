import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const controls = useAnimation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay related to "Secure Handshake"
        await new Promise(resolve => setTimeout(resolve, 1200));

        const user = formData.username.trim().toLowerCase();
        const pass = formData.password.trim();

        if (user === 'admin' && pass === 'admin123') {
            await controls.start({ opacity: 0, y: -20, transition: { duration: 0.3 } });
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } else {
            setError(t('access_denied'));
            setIsLoading(false);
            // Shake effect on error
            const form = document.getElementById('login-form');
            form?.classList.add('animate-shake');
            setTimeout(() => form?.classList.remove('animate-shake'), 500);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]">
            {/* Dynamic Background: Connecting Nodes */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Language Selector */}
            <div className="absolute top-4 right-4 z-50">
                <LanguageSelector />
            </div>

            {/* Floating DNA/Pulse Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    y: [0, 30, 0],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden z-20 bg-slate-900/60 backdrop-blur-3xl border border-white/10"
            >
                {/* Left Side - Professional Branding */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 relative overflow-hidden group">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center space-x-3 mb-10"
                        >
                            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                                <Activity size={24} className="text-[var(--neon-blue)]" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wide">{t('app_title')}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-5xl font-bold font-display leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400"
                        >
                            {t('next_gen_triage')}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-6 text-slate-400 leading-relaxed max-w-sm"
                        >
                            {t('ai_powered_desc')}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center space-x-6 relative z-10"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                                    <User size={16} />
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-slate-500">
                            <strong className="text-white block">{t('stat_value')}</strong>
                            {t('stat_label')}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Interactive Form */}
                <div className="p-10 md:p-14 flex flex-col justify-center relative bg-slate-950/40">
                    <motion.div
                        animate={controls}
                        id="login-form"
                    >
                        <div className="mb-10">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center justify-between"
                            >
                                <h2 className="text-3xl font-bold text-white font-display">{t('welcome_back')}</h2>
                                <div className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    <ShieldCheck size={12} className="mr-1.5" /> {t('encrypted')}
                                </div>
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-slate-400 mt-2"
                            >
                                {t('login_prompt')}
                            </motion.p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-500/10 border-l-2 border-red-500 text-red-300 text-sm p-3 rounded"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2 group"
                            >
                                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wide group-focus-within:text-[var(--neon-blue)] transition-colors">{t('username')}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-blue)] transition-colors" size={18} />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-[var(--neon-blue)] focus:border-transparent outline-none text-white placeholder-slate-600 transition-all shadow-inner"
                                        placeholder={t('enter_id')}
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-2 group"
                            >
                                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wide group-focus-within:text-[var(--neon-purple)] transition-colors">{t('password')}</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-purple)] transition-colors" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-[var(--neon-purple)] focus:border-transparent outline-none text-white placeholder-slate-600 transition-all shadow-inner"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center relative overflow-hidden group mt-6"
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : (
                                    <>
                                        <span className="mr-2">{t('secure_login')}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-xs text-slate-600 font-mono">
                                {t('system_status')}: <span className="text-emerald-500">{t('operational')}</span>
                            </p>
                            <p className="text-[10px] text-slate-700 mt-2">admin / admin123</p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
