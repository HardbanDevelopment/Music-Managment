import React, { useState, useContext } from 'react';
import Card from '../../components/ui/Card';
import { findMarketOpportunities, getCreatorCatalogue } from '../../services/api';
import { MarketTrend, CreativeOpportunity } from '../../types';
import { AuthContext, ToastContext } from '../../context/AuthContext';
import SuspenseLoader from '../../components/ui/SuspenseLoader';
import { SharedIcons } from '../../components/common/Icons';
import TrendCard from '../../components/strategy/TrendCard';
import OpportunityCard from '../../components/strategy/OpportunityCard';

const OpportunityFinderPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    
    const [trends, setTrends] = useState<MarketTrend[]>([]);
    const [opportunities, setOpportunities] = useState<CreativeOpportunity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitial, setIsInitial] = useState(true);

    const handleRunScan = async () => {
        if (!user) {
            addToast('User not found!', 'error');
            return;
        }
        setIsLoading(true);
        setIsInitial(false);
        setOpportunities([]);
        setTrends([]);

        const catalogue = await getCreatorCatalogue(user.id);
        const { trends: newTrends, opportunities: newOpportunities } = await findMarketOpportunities(catalogue, user.role);

        setTrends(newTrends);
        setOpportunities(newOpportunities);
        setIsLoading(false);
        addToast('Market scan complete!', 'success');
    };

    const InitialState = () => (
        <Card className="text-center p-12 bg-gradient-to-br from-dark-card to-dark-bg border-2 border-dashed border-dark-border">
            <div className="w-20 h-20 rounded-full bg-primary-blue/20 flex items-center justify-center mx-auto mb-4 text-primary-blue text-4xl">
                <SharedIcons.Opportunity />
            </div>
            <h2 className="text-2xl font-bold text-white">Find Your Next Big Hit</h2>
            <p className="text-gray-400 mt-2 max-w-xl mx-auto">
                Let our AI scan the market for current trends and analyze your creative profile to generate concrete, actionable opportunities tailored just for you.
            </p>
            <button
                onClick={handleRunScan}
                disabled={isLoading}
                className="mt-8 bg-primary-blue hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all"
            >
                {isLoading ? 'Scanning...' : 'Scan for Opportunities'}
            </button>
        </Card>
    );

    return (
        <div className="space-y-8">
            {isInitial && <InitialState />}
            
            {!isInitial && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Market Scan Results</h2>
                            <p className="text-gray-400">Here's what our AI found for you.</p>
                        </div>
                        <button
                            onClick={handleRunScan}
                            disabled={isLoading}
                            className="bg-dark-border hover:bg-primary-blue text-white font-bold py-2 px-4 rounded-lg text-sm"
                        >
                            {isLoading ? 'Re-scanning...' : 'Re-scan Market'}
                        </button>
                    </div>

                    {isLoading ? <div className="h-96"><SuspenseLoader /></div> : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                             <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">📈 Current Market Trends</h3>
                                {trends.map(trend => <TrendCard key={trend.id} trend={trend} />)}
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">💡 Your Creative Opportunities</h3>
                                {opportunities.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OpportunityFinderPage;
