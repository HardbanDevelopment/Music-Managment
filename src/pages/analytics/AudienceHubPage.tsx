import React, { useState, useEffect, useContext } from 'react';
import Card from '@/components/ui/Card';
import { getAudienceData, generateAudienceSegments } from '@/services/api';
import { AudienceData, AudienceSegment } from '@/types';
import SuspenseLoader from '@/components/ui/SuspenseLoader';
import GeoChart from '@/components/charts/GeoChart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend, LineChart, Line } from 'recharts';
import { SharedIcons } from '@/components/common/Icons';
import { ToastContext } from '@/context/AuthContext';

// --- Local Components for this page ---

const AudienceStatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => {
    return (
        <Card className="p-6">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-dark-bg">
                    <span className="text-2xl text-primary-purple">{icon}</span>
                </div>
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
        </Card>
    );
};

const AudienceSegmentCard: React.FC<{ segment: AudienceSegment; icon: string; color: string; }> = ({ segment, icon, color }) => {
    const colorClasses = {
        purple: 'border-primary-purple bg-primary-purple/10',
        blue: 'border-primary-blue bg-primary-blue/10',
        green: 'border-success-green bg-success-green/10',
    };

    return (
        <Card className={`p-6 border-l-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
            <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl">{icon}</span>
                <div>
                    <h4 className="text-xl font-bold text-white">{segment.name}</h4>
                    <p className="text-sm font-semibold text-gray-300">{segment.sizePercentage}% of Audience</p>
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">{segment.description}</p>
            
            <h5 className="text-sm font-bold text-white mb-2">Key Characteristics:</h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 mb-4">
                {segment.keyCharacteristics.map((char, index) => <li key={index}>{char}</li>)}
            </ul>

            <div className="p-4 rounded-lg bg-dark-bg flex items-start space-x-3">
                 <div className="flex-shrink-0 w-5 h-5 text-primary-purple mt-1"><SharedIcons.AIAssistant/></div>
                <div>
                    <h5 className="text-sm font-bold text-white">Marketing Insight</h5>
                    <p className="text-xs text-gray-400">{segment.marketingInsight}</p>
                </div>
            </div>
        </Card>
    );
};

// --- Main Page Component ---

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
const GENDER_COLORS = ['#8B5CF6', '#3B82F6', '#10B981'];
const SEGMENT_VISUALS = [
    { icon: '🎯', color: 'purple' },
    { icon: '💎', color: 'blue' },
    { icon: '🔭', color: 'green' },
];

const AudienceHubPage: React.FC = () => {
    const [audienceData, setAudienceData] = useState<AudienceData | null>(null);
    const [segments, setSegments] = useState<AudienceSegment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useContext(ToastContext);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getAudienceData();
                setAudienceData(data);
                const aiSegments = await generateAudienceSegments(data);
                setSegments(aiSegments);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e);
                addToast(`Nie udało się pobrać danych odbiorców: ${message}`, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading || !audienceData) {
        return <div className="h-[80vh] flex items-center justify-center"><SuspenseLoader /></div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AudienceStatCard title="Total Audience" value={audienceData.totalAudience.toLocaleString()} icon="👥" />
                <AudienceStatCard title="Engagement Rate" value={`${audienceData.engagementRate}%`} icon="❤️" />
                <AudienceStatCard title="New Followers (30d)" value={`+${audienceData.audienceGrowth[audienceData.audienceGrowth.length - 1].newFollowers.toLocaleString()}`} icon="📈" />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-4">AI Audience Segments</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {segments.map((segment, index) => (
                        <AudienceSegmentCard key={index} segment={segment} {...SEGMENT_VISUALS[index % SEGMENT_VISUALS.length]} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="p-6 lg:col-span-3">
                    <h3 className="text-xl font-bold mb-4 text-white">Audience by Region</h3>
                    <div className="w-full h-[400px] -mx-6 -mb-6">
                        <GeoChart data={audienceData.geoDistribution} />
                    </div>
                </Card>
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">Age Demographics</h3>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={audienceData.fanDemographics.age} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                               <XAxis type="number" hide />
                               <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={50} axisLine={false} tickLine={false} />
                               <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} cursor={{fill: 'rgba(255,255,255,0.1)'}}/>
                               <Bar dataKey="value" name="Percentage" barSize={20}>
                                   {audienceData.fanDemographics.age.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                               </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                     <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">Gender Demographics</h3>
                        <ResponsiveContainer width="100%" height={150}>
                             <PieChart>
                                <Pie data={audienceData.fanDemographics.gender} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                   {audienceData.fanDemographics.gender.map((entry, index) => <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                            </PieChart>
                        </ResponsiveContainer>
                     </Card>
                </div>
            </div>
             <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Audience Growth (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={audienceData.audienceGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Legend />
                        <Line type="monotone" dataKey="newFollowers" name="New Followers" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default AudienceHubPage;
