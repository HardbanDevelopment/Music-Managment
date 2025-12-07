
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { getMediaMentions } from '../../services/api';
import { MediaMention } from '../../types';
import { Link } from 'react-router-dom';
import SuspenseLoader from '../../components/ui/SuspenseLoader';


const SentimentBadge: React.FC<{ sentiment: MediaMention['sentiment'] }> = ({ sentiment }) => {
    const styles = {
        Positive: 'bg-green-500/20 text-green-400',
        Neutral: 'bg-gray-500/20 text-gray-400',
        Negative: 'bg-yellow-500/20 text-yellow-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[sentiment]}`}>{sentiment}</span>;
};

const MediaMonitoringPage: React.FC = () => {
    const [mentions, setMentions] = useState<MediaMention[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMentions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getMediaMentions();
                if ('error' in result) {
                    setError(result.error);
                    setMentions([]);
                } else {
                    setMentions(result);
                }
            } catch (e) {
                setError("An unexpected error occurred.");
                 setMentions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMentions();
    }, []);

    const positiveMentions = mentions.filter(m => m.sentiment === 'Positive').length;
    const positivePercentage = mentions.length > 0 ? Math.round((positiveMentions / mentions.length) * 100) : 0;
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="h-96 flex items-center justify-center"><SuspenseLoader /></div>;
        }

        if (error) {
            return (
                 <div className="text-center py-20">
                     <p className="text-2xl font-bold text-yellow-400">Configuration Required</p>
                    <p className="text-gray-400 mt-2">{error}</p>
                    {error.includes("API keys") && (
                         <Link to="/settings" onClick={() => { /* This is a bit of a hack to force navigation before state changes in parent */ const settingsTab = document.querySelector('button[data-tab-id="integrations"]'); if (settingsTab) { (settingsTab as HTMLElement).click(); } }} className="mt-4 inline-block bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">
                            Go to Settings
                        </Link>
                    )}
                </div>
            );
        }

        if (mentions.length === 0) {
             return (
                 <div className="text-center py-20">
                     <p className="text-2xl font-bold text-white">No Mentions Found</p>
                    <p className="text-gray-400 mt-2">We couldn't find any recent mentions. Check back later!</p>
                </div>
            );
        }

        return (
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-border">
                    <thead className="bg-dark-bg">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Mention</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Sentiment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                        {mentions.map((mention) => (
                            <tr key={mention.id} className="hover:bg-dark-bg">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{mention.source}</td>
                                <td className="px-6 py-4 max-w-md">
                                    <a href={mention.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary-purple font-semibold truncate block">{mention.title}</a>
                                    <p className="text-xs text-gray-500 truncate">{mention.snippet}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <SentimentBadge sentiment={mention.sentiment} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {new Date(mention.publishedAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-primary-blue to-indigo-500 text-white">
                    <p className="text-sm">Total Mentions (Live)</p>
                    <p className="text-4xl font-bold">{isLoading ? '...' : mentions.length}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white">
                    <p className="text-sm">Positive Sentiment</p>
                    <p className="text-4xl font-bold">{isLoading ? '...' : `${positivePercentage}%`}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <p className="text-sm">Estimated Reach</p>
                    <p className="text-4xl font-bold">1.2M</p>
                </Card>
            </div>

            <Card>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white">Recent Mentions</h2>
                    <p className="text-gray-400 mt-1">Real-time feed of your brand mentions across the web.</p>
                </div>
                {renderContent()}
            </Card>
        </div>
    );
};

export default MediaMonitoringPage;
