import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color} flex items-center justify-between`}>
            <div>
                <p className="text-slate-500 text-sm font-medium uppercase">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
                {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-full bg-slate-100 ${color.replace('border-', 'text-')}`}>
                <Icon size={24} />
            </div>
        </div>
    );
};

export default StatCard;
