import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import AudienceHubPage from './analytics/AudienceHubPage';
import CatalogueAuditPage from './analytics/CatalogueAuditPage';

const AnalyticsPage: React.FC = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname.split('/analytics/')[1] || 'audience-hub';
        switch(path) {
            case 'audience-hub': return 'Audience Hub';
            case 'catalogue-audit': return 'Catalogue Potential Audit';
            default: return 'Analytics';
        }
    };

    const navLinks = [
        { path: 'audience-hub', label: 'Audience Hub', icon: '👥' },
        { path: 'catalogue-audit', label: 'Catalogue Audit', icon: '🔍' },
    ];

    const AnalyticsHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/analytics/${link.path}`)
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
                    <AnalyticsHeader />
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="audience-hub" replace />} />
                            <Route path="audience-hub" element={<AudienceHubPage />} />
                            <Route path="catalogue-audit" element={<CatalogueAuditPage />} />
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default AnalyticsPage;
