import React from 'react';

const RiskBadge = ({ level }) => {
    let classes = '';

    switch (level?.toLowerCase()) {
        case 'high':
            classes = 'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse';
            break;
        case 'medium':
            classes = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.4)]';
            break;
        case 'low':
            classes = 'bg-green-500/10 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
            break;
        default:
            classes = 'bg-slate-700 text-slate-300 border-slate-600';
            break;
    }

    return (
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${classes}`}>
            {level}
        </span>
    );
};

export default RiskBadge;
