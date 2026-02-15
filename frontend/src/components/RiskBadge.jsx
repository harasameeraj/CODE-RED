import React from 'react';

const RiskBadge = ({ level }) => {
    let classes = '';

    switch (level?.toLowerCase()) {
        case 'high':
        case 'critical':
            classes = 'bg-red-100 text-red-700';
            break;
        case 'medium':
        case 'moderate':
            classes = 'bg-amber-100 text-amber-700';
            break;
        case 'low':
        case 'stable':
            classes = 'bg-emerald-100 text-emerald-700';
            break;
        default:
            classes = 'bg-slate-100 text-slate-600';
            break;
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${classes}`}>
            {level}
        </span>
    );
};

export default RiskBadge;
