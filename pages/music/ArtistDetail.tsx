

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArtistById, getArtistContracts, getAnalyticsData } from '../../services/api';
import { Artist, ArtistContract, AnalyticsData } from '../../types';
import Card from '../../components/ui/Card';
import ReleaseCard from '../../components/music/ReleaseCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import Tabs from '../../components/ui/Tabs';
import { ToastContext } from '../../context/AuthContext';

import SuspenseLoader from '../../components/ui/SuspenseLoader';

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const ArtistDetail: React.FC = () => {
    const { artistId } = useParams<{ artistId: string }>();
    const { addToast } = useContext(ToastContext);
const [artist, setArtist] = useState<Artist | null>(null);
const [contracts, setContracts] = useState<ArtistContract[]>([]);
const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('overview');

useEffect(() => {
    const fetchData = async () => {
        try {
            const fetchedArtist = await getArtistById(artistId || '');
            if (!fetchedArtist) {
                setLoading(false);
                return;
            }
            const fetchedContracts = await getArtistContracts(artistId || '');
            const fetchedAnalytics = await getAnalyticsData();
            setArtist(fetchedArtist);
            setContracts(fetchedContracts);
            setAnalytics(fetchedAnalytics);
            setLoading(false);
        } catch (e: unknown) {
            addToast(`Nie udało się pobrać szczegółów artysty: ${(e instanceof Error) ? e.message : String(e)}`, 'error');
            setLoading(false);
        }
    };
    fetchData();
}, [artistId]);

if (loading) {
    return <div className="h-[80vh] flex items-center justify-center"><SuspenseLoader /></div>;
}

if (!artist) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Artist not found</h2>
            <Link to="/music/artists" className="text-primary-purple hover:underline">
                Back to Artists
            </Link>
        </div>
    );
}
    
    const releaseData = artist.releases.map(r => ({ name: r.title.substring(0,10) + '...', streams: r.streams, revenue: r.revenue }));
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'releases', label: 'Releases' },
        { id: 'contracts', label: 'Contracts' },
        { id: 'performance', label: 'Performance' },
    ];
    
    return (
        <div className="space-y-8">
            <Link to="/music/artists" className="text-sm text-primary-purple hover:underline mb-4 inline-block">&larr; Back to Artists</Link>
            <Card className="p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <img src={artist.avatar} alt={artist.name} className="w-48 h-48 rounded-full border-4 border-primary-purple shadow-lg" />
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-bold text-white">{artist.name}</h1>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6 text-white">
                        <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Monthly Listeners</p>
                            <p className="text-2xl font-bold">{(artist.monthlyListeners / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Total Streams</p>
                            <p className="text-2xl font-bold">{(artist.totalStreams / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold">${(artist.totalRevenue / 1000).toFixed(0)}k</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
            
            <div className="mt-6">
                {activeTab === 'overview' && (
                     <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">Streams per Release</h3>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={releaseData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${Number(value) / 1000}k`} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                <Bar dataKey="streams" name="Streams">
                                   {releaseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}

                {activeTab === 'releases' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {artist.releases.map(release => (
                            <ReleaseCard key={release.id} release={release} />
                        ))}
                    </div>
                )}
                
                {activeTab === 'contracts' && (
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">Contracts</h3>
                        <table className="min-w-full divide-y divide-dark-border">
                           {/* ... table from royalties ... */}
                           <thead className="bg-dark-bg">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Contract Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Download</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {contracts.map(c => (
                                    <tr key={c.id} className="hover:bg-dark-bg">
                                        <td className="px-6 py-4 text-sm font-medium text-white">{c.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{c.date}</td>
                                        <td className="px-6 py-4 text-sm text-success-green">{c.status}</td>
                                        <td className="px-6 py-4 text-right text-sm"><button className="text-primary-purple hover:underline">Download</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}

                {activeTab === 'performance' && (
                     <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">Performance Trend (Last 6 Months)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.streamsTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                <Legend />
                                <Line type="monotone" dataKey="streams" name="Artist Streams" stroke="#3B82F6" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ArtistDetail;