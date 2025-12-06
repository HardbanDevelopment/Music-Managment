import React from 'react';
import { CreativeOpportunity } from '../../types';
import Card from '../ui/Card';
import { SharedIcons } from '../common/Icons';

const OpportunityCard: React.FC<{ opportunity: CreativeOpportunity }> = ({ opportunity }) => {
    return (
        <Card className="p-6 border-l-4 border-primary-purple bg-primary-purple/5 animate-slide-up">
            <h4 className="text-lg font-bold text-white">{opportunity.title}</h4>
            <p className="text-sm text-gray-400 mt-1 mb-4">{opportunity.description}</p>
            
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-dark-bg text-gray-300">
                        Asset: {opportunity.assetSuggestion.type}
                    </span>
                     <span className="px-3 py-1 text-xs font-semibold rounded-full bg-dark-bg text-gray-300">
                        Format: {opportunity.assetSuggestion.format}
                    </span>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-dark-bg/80 space-y-3">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 text-primary-purple mt-0.5"><SharedIcons.AIAssistant /></div>
                    <div>
                        <h5 className="text-sm font-bold text-white">AI Creative Spark</h5>
                        <p className="text-xs text-gray-400 italic">"{opportunity.aiSnippet.content}"</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 text-primary-purple mt-0.5"><SharedIcons.Strategy /></div>
                    <div>
                        <h5 className="text-sm font-bold text-white">Rationale</h5>
                        <p className="text-xs text-gray-400">{opportunity.rationale}</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-dark-border/50 text-right">
                <button className="text-sm bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">
                    Start Creating &rarr;
                </button>
            </div>
        </Card>
    );
};

export default OpportunityCard;