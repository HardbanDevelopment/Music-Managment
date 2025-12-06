
import React from 'react';
import { PerformanceMetric } from '../../types';

interface PerformanceCardProps {
    metric: PerformanceMetric;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ metric }) => {
    const { title, value, trend, subtext, icon, gradient } = metric;
    
    return (
        <div className={`p-8 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-2xl flex flex-col justify-between transform hover:scale-105 transition-transform duration-300`}>
            <div className="flex justify-between items-start">
                <span className="text-lg font-semibold">{title}</span>
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-5xl font-bold mt-4">{value}</p>
                <div className="flex items-baseline mt-2">
                    <span className="px-3 py-1 text-sm font-semibold text-white bg-white/20 rounded-full">{trend}</span>
                    <p className="ml-3 text-sm opacity-80">{subtext}</p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceCard;
