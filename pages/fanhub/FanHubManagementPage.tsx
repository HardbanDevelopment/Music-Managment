import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import CommunityDashboardPage from './CommunityDashboardPage';

const FanHubManagementPage: React.FC = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname.split('/fanhub/')[1] || 'dashboard';
        switch(path) {
            case 'dashboard': return 'Fan Hub Dashboard';
            default: return 'Fan Hub';
        }
    };

    const navLinks = [
        { path: 'dashboard', label: 'Community Dashboard', icon: '📊' },
        { path: 'subscriptions', label: 'Subscriptions', icon: '⭐' },
        { path: 'content', label: 'Exclusive Content', icon: '✍️' },
    ];

    const FanHubHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/fanhub/${link.path}`)
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
                    <FanHubHeader />
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<CommunityDashboardPage />} />
                            {/* Add routes for other Fan Hub pages here */}
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default FanHubManagementPage;
