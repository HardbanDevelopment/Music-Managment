import React from 'react';
import { MarketTrend } from '../../types';
import Card from '../ui/Card';

const TrendCard: React.FC<{ trend: MarketTrend }> = ({ trend }) => {
    return (
        <Card className="p-4 bg-dark-bg/50">
            <p className="text-xs font-semibold text-primary-blue uppercase">{trend.platform}</p>
            <p className="text-sm text-gray-300 my-2">{trend.description}</p>
            {trend.source && (
                 <a href={trend.source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-primary-blue truncate block">
                    Source: {trend.source.title}
                </a>
            )}
        </Card>
    );
};

export default TrendCard;