import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, subtext, delay = 0 }) => {
    // Extracts specific color for shadow/glow mapping
    const baseColor = color.includes('red') ? '#ef4444' :
        color.includes('yellow') ? '#f59e0b' :
            color.includes('green') ? '#10b981' :
                '#3b82f6';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="glass-panel p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
            style={{
                borderLeft: `4px solid ${baseColor}`
            }}
        >
            {/* Hover Glow Background */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, ${baseColor}, transparent 70%)` }}
            ></div>

            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                <Icon size={80} />
            </div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
                    <h3 className="text-4xl font-bold text-white mt-2 font-display drop-shadow-md">{value}</h3>
                    {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
                </div>
                <div
                    className="p-3 rounded-xl backdrop-blur-md shadow-lg border border-white/5"
                    style={{
                        backgroundColor: `${baseColor}20`, // 20 hex = 12% opacity
                        color: baseColor,
                        boxShadow: `0 0 15px ${baseColor}40`
                    }}
                >
                    <Icon size={24} />
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
