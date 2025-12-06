import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import StoreDashboard from './StoreDashboard';
import Products from './Products';
import Orders from './Orders';

const EcommerceManagementPage: React.FC = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname.split('/ecommerce/')[1] || 'dashboard';
        switch(path) {
            case 'dashboard': return 'Store Dashboard';
            case 'products': return 'Manage Products';
            case 'orders': return 'Manage Orders';
            default: return 'E-commerce';
        }
    };

    const navLinks = [
        { path: 'dashboard', label: 'Dashboard', icon: '📊' },
        { path: 'products', label: 'Products', icon: '👕' },
        { path: 'orders', label: 'Orders', icon: '📦' },
    ];

    const EcommerceHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/ecommerce/${link.path}`)
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
                    <EcommerceHeader />
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<StoreDashboard />} />
                            <Route path="products" element={<Products />} />
                            <Route path="orders" element={<Orders />} />
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default EcommerceManagementPage;