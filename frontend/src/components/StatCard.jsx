import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, subtext, delay = 0 }) => {
    // Map colors to TriageNow palette
    const colorClass = color.includes('red') ? 'text-accent-red bg-accent-red/10' :
        color.includes('yellow') ? 'text-amber-500 bg-amber-500/10' :
            color.includes('green') ? 'text-accent-teal bg-accent-teal/10' :
                'text-brand-600 bg-brand-50'; // Default Blue

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="card-base p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
        >
            <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
                {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
            </div>

            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon size={24} />
            </div>
        </motion.div>
    );
};

export default StatCard;
