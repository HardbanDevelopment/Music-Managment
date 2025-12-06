import React from 'react';
import Card from '../ui/Card';
import { SharedIcons } from '../common/Icons';

interface CommunityPulseCardProps {
    summary: string;
}

const CommunityPulseCard: React.FC<CommunityPulseCardProps> = ({ summary }) => {
    return (
        <Card className="p-6 bg-gradient-to-r from-primary-indigo/10 to-dark-card">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-dark-bg flex items-center justify-center text-primary-indigo text-2xl">
                    <SharedIcons.Analytics />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">AI Community Pulse</h3>
                    <p className="text-sm text-gray-300 mt-1">{summary}</p>
                </div>
            </div>
        </Card>
    );
};

export default CommunityPulseCard;
