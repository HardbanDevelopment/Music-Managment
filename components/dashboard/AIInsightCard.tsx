import React from 'react';
import Card from '../ui/Card';
import { SharedIcons } from '../common/Icons';

interface AIInsightCardProps {
    isLoading: boolean;
    insight: string;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ isLoading, insight }) => {
    
    const LoadingState = () => (
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
                 <div className="w-12 h-12 rounded-full bg-primary-purple/20 flex items-center justify-center">
                    <div className="w-6 h-6 text-primary-purple animate-spin">
                        <SharedIcons.AIAssistant />
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-dark-border rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-dark-border rounded w-1/2 animate-pulse"></div>
            </div>
        </div>
    );

    const ContentState = () => (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-purple/20 flex items-center justify-center">
                    <div className="w-6 h-6 text-primary-purple">
                        <SharedIcons.AIAssistant />
                    </div>
                </div>
            </div>
            <div>
                 <h4 className="font-bold text-lg text-white">AI Strategic Insight</h4>
                 <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{insight}</p>
            </div>
        </div>
    );


    return (
        <Card className="p-6">
            {isLoading ? <LoadingState /> : <ContentState />}
        {/* FIX: Corrected malformed closing tag from `</-card>` to `</Card>`. This was causing multiple parsing errors. */}
        </Card>
    );
};

export default AIInsightCard;
