
import React from 'react';
import Card from '../ui/Card';
import { StatCardData } from '../../types';

interface StatCardProps {
    data: StatCardData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
    const { title, value, trend, icon, description, color } = data;

    return (
        <Card className="p-6 flex items-center space-x-6">
            <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
                <div className="flex items-center mt-1">
                    <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded-full">{trend}</span>
                    <p className="ml-2 text-xs text-gray-500">{description}</p>
                </div>
            </div>
        </Card>
    );
};

export default StatCard;
