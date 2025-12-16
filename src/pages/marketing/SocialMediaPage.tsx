
import React, { useEffect, useState, useContext } from 'react';
import Card from '@/components/ui/Card';
import { getSocialPlatforms } from '@/services/api';
import { SocialPlatform } from '@/types';
import { ToastContext } from '@/context/AuthContext';

interface ScheduledPost {
    id: string;
    content: string;
    platforms: string[]; // Platform IDs
    date: string;
}

const SocialMediaPage: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    
    // State for platforms
    const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getSocialPlatforms();
                if (mounted) setPlatforms(data);
            } catch (e: any) {
                addToast(`Nie udało się pobrać platform: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);
    
    // State for scheduling
    const [postContent, setPostContent] = useState('');
    const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);
    const [scheduleDate, setScheduleDate] = useState('');
    
    // State for upcoming posts list
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

    const handleToggleConnection = (id: string) => {
        const updatedPlatforms = [...platforms];
        const index = updatedPlatforms.findIndex(p => p.id === id);
        if (index !== -1) {
            const platform = updatedPlatforms[index];
            const newStatus = platform.status === 'Connected' ? 'Not Connected' : 'Connected';
            addToast(`${platform.name} ${newStatus === 'Connected' ? 'connected' : 'disconnected'}`, 'success');

            if (newStatus === 'Not Connected') {
                setSelectedPlatformIds(current => current.filter(pid => pid !== id));
            }

            updatedPlatforms[index] = { ...platform, status: newStatus };
            setPlatforms(updatedPlatforms);
        }
    };

    const handlePlatformSelect = (id: string) => {
        setSelectedPlatformIds(prev => 
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleSchedule = () => {
        if (!postContent.trim()) {
            addToast('Please write some content.', 'error');
            return;
        }
        if (selectedPlatformIds.length === 0) {
            addToast('Please select at least one platform.', 'error');
            return;
        }
        if (!scheduleDate) {
            addToast('Please select a date and time.', 'error');
            return;
        }

        const newPost: ScheduledPost = {
            id: Date.now().toString(),
            content: postContent,
            platforms: selectedPlatformIds,
            date: scheduleDate
        };

        setScheduledPosts(prev => [newPost, ...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        addToast('Post scheduled successfully!', 'success');
        
        // Reset form
        setPostContent('');
        setSelectedPlatformIds([]);
        setScheduleDate('');
    };

    const handleCancelPost = (id: string) => {
        setScheduledPosts(prev => prev.filter(post => post.id !== id));
        addToast('Scheduled post cancelled.', 'success');
    };

    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie platform...</div>;
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Scheduler and Upcoming */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="p-8">
                     <h2 className="text-2xl font-bold text-white">Schedule a Post</h2>
                     <p className="text-gray-400 mb-6">Craft your message and schedule it across multiple platforms.</p>
                     
                     <div className="space-y-4">
                        <textarea 
                            rows={4} 
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="w-full bg-dark-bg p-3 rounded-lg border border-dark-border focus:ring-primary-purple focus:border-primary-purple text-white"
                            placeholder="What's on your mind?"
                        />
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {platforms.filter(p => p.status === 'Connected').map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handlePlatformSelect(p.id)}
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                        selectedPlatformIds.includes(p.id)
                                            ? 'bg-primary-purple text-white border-primary-purple'
                                            : 'bg-dark-bg text-gray-400 border-dark-border hover:border-gray-500'
                                    }`}
                                >
                                    <span>{p.icon}</span>
                                    <span>{p.name}</span>
                                </button>
                            ))}
                            {platforms.filter(p => p.status === 'Connected').length === 0 && (
                                <p className="text-xs text-gray-500 italic">Connect platforms to start posting.</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                             <input 
                                type="datetime-local" 
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="bg-dark-bg border border-dark-border rounded-lg p-2 text-white text-sm w-full sm:w-auto"
                            />
                            <button 
                                onClick={handleSchedule}
                                className="bg-primary-blue hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg w-full sm:w-auto"
                            >
                                Schedule Post
                            </button>
                        </div>
                     </div>
                </Card>

                 <Card className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Upcoming Posts</h2>
                    {scheduledPosts.length > 0 ? (
                        <div className="space-y-4">
                            {scheduledPosts.map(post => (
                                <div key={post.id} className="bg-dark-bg p-4 rounded-lg border border-dark-border flex justify-between items-start">
                                    <div>
                                        <p className="text-white mb-2 whitespace-pre-wrap">{post.content}</p>
                                        <div className="flex space-x-2 text-sm">
                                            {post.platforms.map(pid => {
                                                const platform = platforms.find(p => p.id === pid);
                                                return platform ? <span key={pid} title={platform.name}>{platform.icon}</span> : null;
                                            })}
                                            <span className="text-gray-500">•</span>
                                            <span className="text-primary-purple">{new Date(post.date).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleCancelPost(post.id)}
                                        className="text-gray-500 hover:text-red-400 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-dark-border rounded-lg">
                            <p className="text-gray-400">No posts scheduled yet.</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Right Column: Connections */}
            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Connected Platforms</h3>
                    <div className="space-y-3">
                        {platforms.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="text-2xl">{p.icon}</div>
                                    <div>
                                        <p className="font-semibold text-white">{p.name}</p>
                                        <p className={`text-xs font-bold ${p.status === 'Connected' ? 'text-success-green' : 'text-gray-500'}`}>
                                            {p.status}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleToggleConnection(p.id)}
                                    className={`text-xs px-3 py-1 rounded border transition-colors ${
                                        p.status === 'Connected'
                                            ? 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                                            : 'border-success-green/50 text-success-green hover:bg-success-green/10'
                                    }`}
                                >
                                    {p.status === 'Connected' ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-primary-purple/10 rounded-lg border border-primary-purple/20">
                        <h4 className="text-sm font-bold text-primary-purple mb-1">Pro Tip</h4>
                        <p className="text-xs text-gray-300">Connect all your accounts to unlock the unified inbox and cross-platform analytics features.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SocialMediaPage;
