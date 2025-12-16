import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import WalletPage from './WalletPage';
const ForecastingPage = React.lazy(() => import('./ForecastingPage'));

const FinancesManagementPage: React.FC = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname.split('/finances/')[1] || 'wallet';
        switch(path) {
            case 'wallet': return 'My Wallet';
            case 'forecasting': return 'Sales & Revenue Forecasting';
            default: return 'Finances';
        }
    };

    const navLinks = [
        { path: 'wallet', label: 'Wallet', icon: '💰' },
        { path: 'forecasting', label: 'Forecasting', icon: '📈' },
    ];

    const FinancesHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/finances/${link.path}`)
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
                    <FinancesHeader />
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="wallet" replace />} />
                            <Route path="wallet" element={<WalletPage />} />
                            <Route path="forecasting" element={<ForecastingPage />} />
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default FinancesManagementPage;