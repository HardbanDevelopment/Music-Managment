import React, { useState, useContext } from 'react';
import { EngagementOpportunity } from '../../types';
import Card from '../ui/Card';
import { ToastContext } from '../../context/AuthContext';

const EngagementOpportunityCard: React.FC<{ opportunity: EngagementOpportunity }> = ({ opportunity }) => {
    const { addToast } = useContext(ToastContext);
    const [reply, setReply] = useState(opportunity.aiReplySuggestion);

    const handleReply = () => {
        addToast(`Replied to ${opportunity.fanName}!`, 'success');
        // In a real app, this would submit the reply via an API
    };

    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-center space-x-3">
                <img src={opportunity.fanAvatar} alt={opportunity.fanName} className="w-8 h-8 rounded-full" />
                <div>
                    <p className="font-semibold text-sm text-white">{opportunity.fanName}</p>
                    <p className="text-xs text-gray-400 italic">commented:</p>
                </div>
            </div>

            <blockquote className="text-sm text-gray-300 border-l-2 border-dark-border pl-3">
                {opportunity.comment}
            </blockquote>

            <div>
                <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={3}
                    className="w-full bg-dark-bg p-2 rounded-md border border-dark-border text-sm"
                />
            </div>
            <div className="text-right">
                <button
                    onClick={handleReply}
                    className="bg-primary-blue hover:bg-blue-600 text-white font-bold py-1 px-4 rounded-lg text-sm"
                >
                    Reply
                </button>
            </div>
        </Card>
    );
};

export default EngagementOpportunityCard;
