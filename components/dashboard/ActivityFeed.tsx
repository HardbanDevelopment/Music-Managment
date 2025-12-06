
import React from 'react';
import Card from '../ui/Card';
import { ActivityItem, ActivityStatus } from '../../types';

interface ActivityFeedProps {
    activities: ActivityItem[];
}

const StatusIndicator: React.FC<{ status: ActivityStatus }> = ({ status }) => {
    const baseClasses = "w-2 h-2 rounded-full animate-pulse";
    const colorClass = status === ActivityStatus.SUCCESS ? "bg-success-green" : status === ActivityStatus.PENDING ? "bg-warning-yellow" : "bg-error-red";
    return <div className={`${baseClasses} ${colorClass}`}></div>;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
    return (
        <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-dark-bg transition-colors">
                        <div className="text-2xl mt-1">{item.emoji}</div>
                        <div className="flex-1">
                            <p className="font-semibold text-white">{item.title}</p>
                            <p className="text-sm text-gray-400">{item.details}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <StatusIndicator status={item.status} />
                            <span>{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ActivityFeed;
