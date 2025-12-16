import React, { useState, useContext, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { getCreativeFeedbackHistory, analyzeCreativeIdea, addCreativeFeedback, getAudienceData } from '@/services/api';
import { CreativeFeedback, AudienceData } from '@/types';
import { AuthContext, ToastContext } from '@/context/AuthContext';
import SuspenseLoader from '@/components/ui/SuspenseLoader';
import FeedbackCard from '@/components/creative/FeedbackCard';
import { SharedIcons } from '@/components/common/Icons';

const AIFeedbackPage: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [history, setHistory] = useState<CreativeFeedback[]>([]);
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const historyData = await getCreativeFeedbackHistory();
            setHistory(historyData);
            setIsHistoryLoading(false);
        };
        fetchHistory();
    }, []);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idea.trim()) return;

        setIsLoading(true);
        try {
            const audienceData = await getAudienceData();
            const result = await analyzeCreativeIdea(idea, audienceData);
            const newFeedback = await addCreativeFeedback(result);
            setHistory(prev => [newFeedback, ...prev]);
            addToast('Creative analysis complete!', 'success');
            setIdea('');
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            addToast(`Nie udało się przeanalizować pomysłu: ${message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card className="p-8">
                 <div className="flex items-start space-x-4">
                    <div className="text-3xl mt-1 text-primary-purple"><SharedIcons.Creative /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">AI Creative Feedback Loop</h1>
                        <p className="text-gray-400 mt-1">Get data-driven feedback on your creative ideas before you invest time and resources.</p>
                    </div>
                </div>
                <form onSubmit={handleAnalyze} className="mt-6 space-y-4">
                    <textarea 
                        value={idea}
                        onChange={e => setIdea(e.target.value)}
                        rows={4}
                        className="w-full bg-dark-bg p-3 rounded-lg border border-dark-border focus:ring-primary-purple focus:border-primary-purple"
                        placeholder="Enter a song title, a lyric snippet, a book chapter idea, or a plot point..."
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !idea.trim()}
                        className="w-full bg-primary-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                           <>
                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                            Analyzing...
                           </>
                        ) : 'Analyze Idea with AI'}
                    </button>
                </form>
            </Card>

            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Analysis History</h2>
                {isHistoryLoading ? <SuspenseLoader /> : (
                    <div className="space-y-6">
                        {history.map(item => (
                            <FeedbackCard key={item.id} feedback={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIFeedbackPage;
