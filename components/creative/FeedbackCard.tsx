import React from 'react';
import { CreativeFeedback, EmotionalMetric } from '../../types';
import Card from '../ui/Card';
import { SharedIcons } from '../common/Icons';

const EmotionMeter: React.FC<{ metric: EmotionalMetric }> = ({ metric }) => {
    const colors = {
        Nostalgia: 'bg-indigo-500',
        Excitement: 'bg-rose-500',
        Melancholy: 'bg-blue-500',
        Tension: 'bg-yellow-500',
        Joy: 'bg-green-500',
    };
    const colorClass = colors[metric.emotion] || 'bg-gray-500';

    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-300">{metric.emotion}</span>
                <span className="text-xs font-semibold text-white">{metric.score}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-1.5">
                <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${metric.score}%` }}></div>
            </div>
        </div>
    );
};


const FeedbackCard: React.FC<{ feedback: CreativeFeedback }> = ({ feedback }) => {
    const potentialColor = feedback.commercialPotential > 75 
        ? 'text-success-green' 
        : feedback.commercialPotential > 50 
        ? 'text-warning-yellow' 
        : 'text-error-red';

    return (
        <Card className="p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <p className="text-xs text-gray-500">Analyzed on {new Date(feedback.analysisDate).toLocaleDateString()}</p>
                        <blockquote className="text-lg font-semibold text-white italic border-l-4 border-primary-purple pl-4 my-2">
                            "{feedback.ideaSnippet}"
                        </blockquote>
                    </div>
                    <div>
                        <h4 className="text-md font-bold text-white mb-2">Creative Suggestions</h4>
                        <ul className="space-y-2">
                            {feedback.creativeSuggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <div className="text-primary-purple mt-1 flex-shrink-0"><SharedIcons.AIAssistant /></div>
                                    <p className="text-sm text-gray-300">{suggestion}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-6 bg-dark-bg p-4 rounded-lg">
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-400">Commercial Potential</p>
                        <p className={`text-6xl font-bold ${potentialColor}`}>{feedback.commercialPotential}%</p>
                    </div>
                    <div>
                        <h4 className="text-md font-bold text-white mb-3 text-center">Key Emotional Triggers</h4>
                        <div className="space-y-3">
                            {feedback.keyEmotions.map(emotion => (
                                <EmotionMeter key={emotion.emotion} metric={emotion} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default FeedbackCard;