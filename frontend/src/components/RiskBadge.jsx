import React from 'react';

const RiskBadge = ({ level }) => {
    let colorClass = 'bg-slate-100 text-slate-600';

    switch (level?.toLowerCase()) {
        case 'high':
            colorClass = 'bg-red-100 text-red-700 border border-red-200';
            break;
        case 'medium':
            colorClass = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
            break;
        case 'low':
            colorClass = 'bg-green-100 text-green-700 border border-green-200';
            break;
        default:
            break;
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {level}
        </span>
    );
};

export default RiskBadge;
