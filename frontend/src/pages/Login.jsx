import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        const user = formData.username.trim().toLowerCase();
        const pass = formData.password.trim();

        if (user === 'admin' && pass === 'admin123') {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } else {
            setError(t('access_denied'));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] p-4 font-sans text-slate-600">
            <div className="absolute top-6 right-6 z-50">
                <LanguageSelector />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm bg-[#e0e5ec] rounded-[3rem] p-8 md:p-12 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-24 h-24 rounded-full bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] flex items-center justify-center mb-6 text-slate-500">
                        <User size={40} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-700 mb-2 tracking-tight">{t('welcome_back')}</h1>
                    <p className="text-slate-500 text-sm">{t('login_prompt')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-500 text-sm text-center font-medium bg-red-100/50 py-2 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder={t('username')}
                                className="w-full pl-12 pr-6 py-4 bg-[#e0e5ec] rounded-2xl shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.7),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)] text-slate-600 outline-none focus:ring-0 transition-all placeholder-slate-400 text-sm font-medium"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={t('password')}
                                className="w-full pl-12 pr-6 py-4 bg-[#e0e5ec] rounded-2xl shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.7),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)] text-slate-600 outline-none focus:ring-0 transition-all placeholder-slate-400 text-sm font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox text-blue-500 rounded bg-[#e0e5ec] border-slate-300 shadow-[inset_2px_2px_4px_0_rgba(163,177,198,0.7),inset_-2px_-2px_4px_0_rgba(255,255,255,0.8)] w-4 h-4" />
                            <span>Remember me</span>
                        </label>
                        <button type="button" className="hover:text-blue-600 transition-colors">Forgot password?</button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-2xl bg-[#e0e5ec] text-slate-700 font-bold shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] active:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] active:translate-y-[1px] transition-all flex items-center justify-center hover:text-blue-600 text-sm uppercase tracking-wider mt-8"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-5 h-5 border-2 border-slate-400 border-t-blue-500 rounded-full"
                            />
                        ) : (
                            t('secure_login')
                        )}
                    </button>

                    <div className="mt-10 text-center">
                        <div className="px-6 py-3 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] inline-block">
                            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Pragnya Hackathon Prototype</span>
                        </div>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-slate-400 font-mono">admin / admin123</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
