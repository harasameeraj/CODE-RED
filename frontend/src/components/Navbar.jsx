import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, PlusCircle, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const { t } = useTranslation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent';
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-4 z-50 mx-4"
        >
            <div className="glass-panel px-6 py-3 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center space-x-6">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.7)] transition-all duration-300">
                            <Activity size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold font-display tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{t('app_title')}</span>
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex space-x-2 bg-slate-800/50 p-1 rounded-xl border border-white/5">
                        <Link to="/" className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${isActive('/')}`}>
                            <LayoutDashboard size={18} />
                            <span className="font-medium text-sm">{t('dashboard')}</span>
                        </Link>
                        <Link to="/triage" className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${isActive('/triage')}`}>
                            <PlusCircle size={18} />
                            <span className="font-medium text-sm">{t('add_patient')}</span>
                        </Link>
                        <Link to="/patients" className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${isActive('/patients')}`}>
                            <FileText size={18} />
                            <span className="font-medium text-sm">{t('patients')}</span>
                        </Link>
                    </div>

                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                    <LanguageSelector />

                    <button
                        onClick={() => {
                            localStorage.removeItem('isAuthenticated');
                            window.location.href = '/login';
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
