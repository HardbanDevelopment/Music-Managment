import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { getCommunityAnalytics } from '../../services/api';
import { CommunityAnalytics } from '../../types';
import SuspenseLoader from '../../components/ui/SuspenseLoader';
import { SharedIcons } from '../../components/common/Icons';
import CommunityPulseCard from '../../components/fanhub/CommunityPulseCard';
import TopFanCard from '../../components/fanhub/TopFanCard';
import EngagementOpportunityCard from '../../components/fanhub/EngagementOpportunityCard';

const CommunityDashboardPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<CommunityAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getCommunityAnalytics();
            setAnalytics(data);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading || !analytics) {
        return <div className="h-[80vh] flex items-center justify-center"><SuspenseLoader /></div>;
    }

    return (
        <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white">
                    <p className="text-sm">Total Subscribers</p>
                    <p className="text-4xl font-bold">1,254</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    <p className="text-sm">Monthly Revenue</p>
                    <p className="text-4xl font-bold">$4,820</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <p className="text-sm">Engagement Rate</p>
                    <p className="text-4xl font-bold">12.8%</p>
                </Card>
            </div>
            
            <CommunityPulseCard summary={analytics.communityPulseSummary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">⭐ Top Fans</h3>
                    {analytics.topFans.map(fan => <TopFanCard key={fan.fanId} fan={fan} />)}
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">💬 Engagement Opportunities</h3>
                    {analytics.engagementOpportunities.map(opp => <EngagementOpportunityCard key={opp.interactionId} opportunity={opp} />)}
                </div>
            </div>
        </div>
    );
};

export default CommunityDashboardPage;
