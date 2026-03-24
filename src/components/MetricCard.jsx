import React from 'react';

const MetricCard = ({ title, value, icon, trend, trendPositive }) => {
    return (
        <div className="glass-panel p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            {/* Top Row: Title and Icon */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">
                    {title}
                </h3>
                {/* The icon gets a nice little frosted background container */}
                <div className="p-2 bg-slate-800/80 rounded-lg text-primary shadow-inner">
                    {icon}
                </div>
            </div>
            
            {/* Bottom Row: Big Value and Optional Trend */}
            <div>
                <div className="text-3xl font-bold text-slate-100 tracking-tight">
                    {value}
                </div>
                
                {/* If we pass a trend (like "+5%"), it shows up here in green or red! */}
                {trend && (
                    <div className={`text-sm mt-2 font-medium flex items-center gap-1 ${trendPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span>{trendPositive ? '↑' : '↓'}</span>
                        <span>{trend}</span>
                        <span className="text-slate-500 ml-1 font-normal">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricCard;