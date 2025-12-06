import React from 'react';
import { AuditOpportunity } from '../../types';
import Card from '../ui/Card';
import { SharedIcons } from '../common/Icons';

const OpportunityCard: React.FC<{ opportunity: AuditOpportunity }> = ({ opportunity }) => {
    const potentialColor = opportunity.potentialScore > 75 
        ? 'text-success-green' 
        : opportunity.potentialScore > 50 
        ? 'text-warning-yellow' 
        : 'text-error-red';
    
    const icon = opportunity.assetType === 'Music' ? '🎵' : '📖';

    return (
        <Card className="p-6 animate-fade-in grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 text-center bg-dark-bg p-4 rounded-lg flex flex-col justify-center items-center">
                <p className="text-sm font-semibold text-gray-400">Potential Score</p>
                <p className={`text-7xl font-bold ${potentialColor}`}>{opportunity.potentialScore}</p>
            </div>

            <div className="md:col-span-3">
                 <div className="mb-4">
                    <p className="text-xs text-gray-500">{opportunity.assetType}</p>
                    <h3 className="text-xl font-bold text-white">
                        <span className="mr-2">{icon}</span>
                        {opportunity.assetTitle}
                    </h3>
                </div>

                <div className="mb-4 flex items-start space-x-3 bg-dark-bg/50 p-3 rounded-lg">
                    <div className="text-primary-purple mt-1 flex-shrink-0 text-lg"><SharedIcons.AIAssistant /></div>
                    <div>
                        <h4 className="text-sm font-bold text-white">AI Insight</h4>
                        <p className="text-sm text-gray-300 italic">"{opportunity.insight}"</p>
                    </div>
                </div>

                 <div>
                    <h4 className="text-sm font-bold text-white mb-2">Suggested Actions</h4>
                    <ul className="space-y-2">
                        {opportunity.suggestedActions.map((action, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <span className="text-success-green">✓</span>
                                <p className="text-sm text-gray-400">{action}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export default OpportunityCard;
