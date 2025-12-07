import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import GeoChart from '../../components/charts/GeoChart';
import { getAnalyticsData, getPlaylistPlacements } from '../../services/api';
import Card from '../../components/ui/Card';
import { ToastContext } from '../../context/AuthContext';
import { AnalyticsData } from '../../types';

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
const GENDER_COLORS = ['#8B5CF6', '#3B82F6', '#10B981'];

const MusicAnalyticsPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [playlistPlacements, setPlaylistPlacements] = useState<PlaylistPlacement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        if (!user) return;
        (async () => {
            try {
                const analytics = await getAnalyticsData(user.id);
                const placements = await getPlaylistPlacements();
                if (!mounted) return;
                setAnalyticsData(analytics);
                setPlaylistPlacements(placements);
            } catch (e: unknown) {
                addToast(`Nie udało się pobrać danych analitycznych: ${(e instanceof Error) ? e.message : String(e)}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [user, addToast]);

    if (!user) return null;
    if (loading || !analyticsData) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie analityki...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Streams Trend (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.streamsTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${Number(value) / 1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                            <Legend />
                            <Line type="monotone" dataKey="streams" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Total Revenue Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={analyticsData.revenueBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                {analyticsData.revenueBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <Card className="p-6 lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4 text-white">Fan Demographics (Age)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.fanDemographics.age} layout="vertical">
                           <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                           <XAxis type="number" stroke="#9CA3AF" />
                           <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={50} />
                           <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                           <Bar dataKey="value" name="Percentage">
                               {analyticsData.fanDemographics.age.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                           </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                 </Card>
                 <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-white">Fan Demographics (Gender)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={analyticsData.fanDemographics.gender} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} label>
                               {analyticsData.fanDemographics.gender.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        </PieChart>
                    </ResponsiveContainer>
                 </Card>
            </div>
            
             <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Recent Playlist Placements</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-border">
                        <thead className="bg-dark-bg">
                           <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Playlist</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Platform</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Followers</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Release</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {playlistPlacements.map(p => (
                                <tr key={p.id} className="hover:bg-dark-bg">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{p.playlistName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{p.platform}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{p.followers.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{p.releaseTitle}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Streams by Region</h3>
                <div className="w-full h-[400px]">
                    <GeoChart data={analyticsData.geoDistribution} />
                </div>
            </Card>
        </div>
    );
};

export default MusicAnalyticsPage;
