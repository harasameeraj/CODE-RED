import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            {/* YouTube Video Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <iframe
                    className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                    src="https://www.youtube.com/embed/W5Dm2WCk8jg?autoplay=1&mute=1&controls=0&loop=1&playlist=W5Dm2WCk8jg&showinfo=0&rel=0&iv_load_policy=3&disablekb=1"
                    title="Background Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ pointerEvents: 'none' }}
                ></iframe>
                {/* Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="absolute top-6 right-6 z-50">
                <LanguageSelector />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-sm relative z-10 p-8 md:p-12 rounded-[2rem] border border-white/20 bg-black/30 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-white backdrop-blur-md shadow-lg">
                        <User size={36} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md">{t('welcome_back')}</h1>
                    <p className="text-white/70 text-sm font-medium">{t('login_prompt')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-200 text-sm text-center font-medium bg-red-500/20 border border-red-500/30 py-2 rounded-lg backdrop-blur-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder={t('username')}
                                className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:bg-white/20 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all placeholder-white/40 text-sm font-medium backdrop-blur-sm"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={t('password')}
                                className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:bg-white/20 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all placeholder-white/40 text-sm font-medium backdrop-blur-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/70 px-2">
                        <label className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                            <input type="checkbox" className="form-checkbox text-blue-500 rounded bg-white/10 border-white/30 w-4 h-4 focus:ring-offset-0 focus:ring-blue-500" />
                            <span>Remember me</span>
                        </label>
                        <button type="button" className="hover:text-white transition-colors font-medium">Forgot password?</button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-2xl bg-white text-black font-bold shadow-lg hover:shadow-xl hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center text-sm uppercase tracking-wider mt-8"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                            />
                        ) : (
                            t('secure_login')
                        )}
                    </button>

                    <div className="mt-10 text-center">
                        <div className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md inline-block">
                            <span className="text-xs font-bold text-white/80 tracking-wider uppercase">Pragnya Hackathon Prototype</span>
                        </div>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-white/40 font-mono tracking-widest">admin / admin123</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
