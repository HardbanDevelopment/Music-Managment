

import React, { useEffect, useState, useContext } from 'react';
import { getMusicData, getAnalyticsData } from '@/services/api';
import ReleaseCard from '@/components/music/ReleaseCard';
import ArtistCard from '@/components/music/ArtistCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/components/ui/Card';
import { ToastContext } from '@/context/AuthContext';

const MusicDashboard: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [releases, setReleases] = useState([] as ReturnType<typeof Array.prototype.slice> & any);
    const [artists, setArtists] = useState([] as ReturnType<typeof Array.prototype.slice> & any);
    const [streamsTrend, setStreamsTrend] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const music = await getMusicData();
                const analytics = await getAnalyticsData();
                if (!mounted) return;
                setReleases(music.releases);
                setArtists(music.artists);
                setStreamsTrend(analytics.streamsTrend);
            } catch (e: any) {
                addToast(`Nie udało się pobrać danych muzycznych: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <div className="text-gray-300">Ładowanie danych...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary-purple to-primary-indigo">
                    <p className="text-lg text-indigo-200">Total Releases</p>
                    <p className="text-5xl font-bold text-white">{releases.length}</p>
                </Card>
                <Card className="p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary-blue to-teal-500">
                    <p className="text-lg text-blue-200">Total Artists</p>
                    <p className="text-5xl font-bold text-white">{artists.length}</p>
                </Card>
                 <Card className="p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-green-500 to-yellow-500">
                    <p className="text-lg text-yellow-200">Total Streams</p>
                    <p className="text-5xl font-bold text-white">{(releases.reduce((acc, r) => acc + r.streams, 0) / 1000000).toFixed(1)}M</p>
                </Card>
            </div>
            
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Streams Trend (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={streamsTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${Number(value) / 1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Legend />
                        <Line type="monotone" dataKey="streams" name="Total Streams" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Recent Releases</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {releases.slice(0, 3).map(release => (
                        <ReleaseCard key={release.id} release={release} />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Top Artists</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {artists.map(artist => (
                        <ArtistCard key={artist.id} artist={artist} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MusicDashboard;
