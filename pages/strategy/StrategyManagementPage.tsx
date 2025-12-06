import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import GoalsHubPage from './GoalsHubPage';
const OpportunityFinderPage = React.lazy(() => import('./OpportunityFinderPage'));
const BrandSentinelPage = React.lazy(() => import('./BrandSentinelPage'));

const StrategyManagementPage: React.FC = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname.split('/strategy/')[1] || 'goals';
        switch(path) {
            case 'goals': return 'Goals & Strategy Hub';
            case 'opportunity-finder': return 'Market Opportunity Finder';
            case 'brand-sentinel': return 'AI Brand Sentinel';
            default: return 'Strategy';
        }
    };

    const navLinks = [
        { path: 'goals', label: 'Goals Hub', icon: '🎯' },
        { path: 'opportunity-finder', label: 'Opportunity Finder', icon: '💡' },
        { path: 'brand-sentinel', label: 'Brand Sentinel', icon: '🛡️' }
    ];

    const StrategyHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/strategy/${link.path}`)
                             ? 'bg-primary-purple text-white'
                             : 'text-gray-300 hover:bg-dark-border hover:text-white'
                        }`}
                    >
                         <span className="mr-2 text-lg">{link.icon}</span> {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <DashboardPage 
            title={getTitle()} 
            component={
                <div className="space-y-6">
                    <StrategyHeader />
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="goals" replace />} />
                            <Route path="goals" element={<GoalsHubPage />} />
                            <Route path="opportunity-finder" element={<OpportunityFinderPage />} />
                            <Route path="brand-sentinel" element={<BrandSentinelPage />} />
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default StrategyManagementPage;