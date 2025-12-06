import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { generateAITrack } from '../../services/api';
import { GeneratedTrack, Role } from '../../types';
import { AuthContext } from '../../context/AuthContext';

const AIStudioPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [genre, setGenre] = useState('Chillwave');
    const [mood, setMood] = useState('Nostalgic');
    const [duration, setDuration] = useState(60);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);

    if (user && ![Role.ADMIN, Role.MUSIC_CREATOR].includes(user.role)) {
        return <Navigate to="/home" replace />;
    }

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedTrack(null);
        const track = await generateAITrack(genre, mood, duration);
        setGeneratedTrack(track);
        setIsLoading(false);
    };

    const LoadingState = () => (
         <div className="flex flex-col items-center justify-center space-y-4 text-center h-64">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-primary-blue rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-primary-purple rounded-full animate-ping"></div>
                <div className="w-full h-full flex items-center justify-center text-primary-purple text-4xl">
                   🎵
                </div>
            </div>
            <p className="text-xl font-semibold text-white">Composing your track...</p>
            <p className="text-gray-400">The AI is warming up its synthesizers. This might take a moment.</p>
        </div>
    );
    
    const TrackPlayer: React.FC<{ track: GeneratedTrack }> = ({ track }) => (
        <Card className="p-6 bg-gradient-to-br from-primary-purple to-primary-indigo">
            <h3 className="text-2xl font-bold text-white">{track.title}</h3>
            <div className="flex space-x-4 text-sm text-indigo-200 mt-2">
                <span>{track.genre}</span>
                <span>•</span>
                <span>{track.mood}</span>
                <span>•</span>
                <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
            </div>
            <audio controls src={track.url} className="w-full mt-4 rounded-lg"></audio>
        </Card>
    );

    return (
        <div className="space-y-8">
            <Card className="p-8">
                <h2 className="text-3xl font-bold text-white">AI Music Studio</h2>
                <p className="text-gray-400 mt-1">Generate royalty-free tracks for your projects.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div>
                        <label className="text-sm text-gray-400">Genre</label>
                        <select value={genre} onChange={e => setGenre(e.target.value)} className="mt-1 w-full bg-dark-bg p-3 rounded-lg border border-dark-border">
                            <option>Chillwave</option>
                            <option>Lofi Hip Hop</option>
                            <option>Orchestral</option>
                            <option>Ambient</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Mood</label>
                        <select value={mood} onChange={e => setMood(e.target.value)} className="mt-1 w-full bg-dark-bg p-3 rounded-lg border border-dark-border">
                            <option>Nostalgic</option>
                            <option>Focus</option>
                            <option>Uplifting</option>
                            <option>Melancholic</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Duration (seconds)</label>
                        <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="mt-1 w-full bg-dark-bg p-3 rounded-lg border border-dark-border" />
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="mt-8 w-full bg-primary-blue hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : 'Generate Track'}
                </button>
            </Card>

            {isLoading && <LoadingState />}
            {generatedTrack && <TrackPlayer track={generatedTrack} />}

        </div>
    );
};

export default AIStudioPage;