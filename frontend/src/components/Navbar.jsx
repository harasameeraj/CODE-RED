import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, Globe, LogOut, Sun, Moon, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Navbar = ({ setIsAuthenticated }) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    // Dark Mode Logic
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsLangMenuOpen(false);
    };

    return (
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-brand-600 p-1.5 rounded-lg shadow-lg shadow-brand-500/20">
                                <Activity size={20} className="text-white" />
                            </div>
                            <span className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight transition-colors">
                                TriageNow
                            </span>
                        </Link>
                    </div>

                    {/* Centered Navigation Tabs */}
                    <div className="hidden md:flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                        <Link to="/" className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}>
                            <div className="flex items-center space-x-2">
                                <LayoutDashboard size={16} />
                                <span>{t('overview', 'Overview')}</span>
                            </div>
                        </Link>
                        <Link to="/triage" className={`nav-tab ${location.pathname === '/triage' ? 'active' : ''}`}>
                            <div className="flex items-center space-x-2">
                                <PlusCircle size={16} />
                                <span>{t('triage', 'Triage')}</span>
                            </div>
                        </Link>
                        <Link to="/patients" className={`nav-tab ${location.pathname === '/patients' ? 'active' : ''}`}>
                            <div className="flex items-center space-x-2">
                                <FileText size={16} />
                                <span>{t('records', 'Records')}</span>
                            </div>
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Globe size={20} />
                            </button>

                            {isLangMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1"
                                >
                                    <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">English</button>
                                    <button onClick={() => changeLanguage('hi')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Hindi (हिंदी)</button>
                                    <button onClick={() => changeLanguage('te')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Telugu (తెలుగు)</button>
                                    <button onClick={() => changeLanguage('ta')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Tamil (தமிழ்)</button>
                                </motion.div>
                            )}
                        </div>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors text-sm font-medium"
                        >
                            <LogOut size={18} />
                            <span className="hidden md:inline">{t('sign_out', 'Sign Out')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
