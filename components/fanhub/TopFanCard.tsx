import React from 'react';
import { TopFan } from '../../types';
import Card from '../ui/Card';
import { SharedIcons } from '../common/Icons';

const TopFanCard: React.FC<{ fan: TopFan }> = ({ fan }) => {
    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-center space-x-3">
                <img src={fan.fanAvatar} alt={fan.fanName} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-white">{fan.fanName}</p>
                    <p className="text-xs text-gray-400">Top Fan</p>
                </div>
            </div>

            <div className="p-3 rounded-lg bg-dark-bg/50 space-y-2">
                 <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-4 h-4 text-primary-purple mt-0.5"><SharedIcons.AIAssistant /></div>
                    <div>
                        <h5 className="text-xs font-bold text-white">Reason</h5>
                        <p className="text-xs text-gray-400">{fan.reason}</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-4 h-4 text-success-green mt-0.5"><SharedIcons.Strategy /></div>
                    <div>
                        <h5 className="text-xs font-bold text-white">Suggested Action</h5>
                        <p className="text-xs text-gray-400">{fan.suggestedAction}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TopFanCard;
