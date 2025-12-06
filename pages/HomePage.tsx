// FIX: This was a placeholder file. Implemented the HomePage component.
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Role, StatCardData, PerformanceMetric, ActivityItem } from '../types';
import { getAdminDashboardData, getCreatorDashboardData, getAIInsight } from '../services/api';
import { SharedIcons } from '../components/common/Icons';
import StatCard from '../components/dashboard/StatCard';
import PerformanceCard from '../components/dashboard/PerformanceCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import AIInsightCard from '../components/dashboard/AIInsightCard';
import AnalyticsCharts from '../components/charts/AnalyticsChart';

const HomePage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState<StatCardData[]>([]);
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [insight, setInsight] = useState('');
    const [isLoadingInsight, setIsLoadingInsight] = useState(true);

    useEffect(() => {
        if (!user) return;

        let data;
        if (user.role === Role.ADMIN) {
            data = getAdminDashboardData();
            setStats([
                { title: 'Total Revenue', value: `$${(data.stats.totalRevenue / 1000).toFixed(0)}k`, trend: '+5.2%', icon: <SharedIcons.Analytics />, description: 'last 30 days', color: 'bg-primary-purple/20' },
                { title: 'Total Streams', value: `${(data.stats.totalStreams / 1000000).toFixed(1)}M`, trend: '+12.1%', icon: <SharedIcons.Music />, description: 'last 30 days', color: 'bg-primary-blue/20' },
                { title: 'Active Artists', value: `${data.stats.activeArtists}`, trend: '+2', icon: <SharedIcons.Contacts />, description: 'this month', color: 'bg-success-green/20' },
                { title: 'Active Authors', value: `${data.stats.activeAuthors}`, trend: '+1', icon: <SharedIcons.Publishing />, description: 'this month', color: 'bg-warning-yellow/20' }
            ]);
            setActivities(data.activities);
        } else {
            data = getCreatorDashboardData(user.id, user.role);
            if (user.role === Role.MUSIC_CREATOR) {
                setStats([
                    { title: 'Monthly Listeners', value: `${(data.stats.monthlyListeners / 1000000).toFixed(1)}M`, trend: '+8%', icon: <SharedIcons.Analytics />, description: 'last 30 days', color: 'bg-primary-purple/20' },
                    { title: 'Total Streams', value: `${(data.stats.totalStreams / 1000000).toFixed(1)}M`, trend: '+15%', icon: <SharedIcons.Music />, description: 'all time', color: 'bg-primary-blue/20' },
                ]);
            } else if (user.role === Role.BOOK_AUTHOR) {
                 setStats([
                    { title: 'Total Sales', value: `${(data.stats.totalSales).toLocaleString()}`, trend: '+120', icon: <SharedIcons.Publishing />, description: 'last 30 days', color: 'bg-success-green/20' },
                    { title: 'Total Revenue', value: `$${(data.stats.totalRevenue / 1000).toFixed(0)}k`, trend: '+$2.1k', icon: <SharedIcons.Analytics />, description: 'last 30 days', color: 'bg-primary-purple/20' },
                ]);
            }
             setActivities(data.activities || []);
        }
        
        const fetchInsight = async () => {
            setIsLoadingInsight(true);
            const aiInsight = await getAIInsight(JSON.stringify(data.stats));
            setInsight(aiInsight);
            setIsLoadingInsight(false);
        };
        fetchInsight();

    }, [user]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => <StatCard key={stat.title} data={stat} />)}
            </div>

            <AIInsightCard isLoading={isLoadingInsight} insight={insight} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AnalyticsCharts role={user.role} userId={user.id} />
                </div>
                <div>
                    <ActivityFeed activities={activities} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
