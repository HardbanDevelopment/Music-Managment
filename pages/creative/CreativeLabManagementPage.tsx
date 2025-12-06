import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import AIFeedbackPage from './AIFeedbackPage';

const CreativeLabManagementPage: React.FC = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname.split('/creative/')[1] || 'feedback';
        switch(path) {
            case 'feedback': return 'Creative Lab: AI Feedback Loop';
            default: return 'Creative Lab';
        }
    };

    const navLinks = [
        { path: 'feedback', label: 'AI Feedback', icon: '💡' },
    ];

    const CreativeHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/creative/${link.path}`)
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
                    <CreativeHeader />
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="feedback" replace />} />
                            <Route path="feedback" element={<AIFeedbackPage />} />
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default CreativeLabManagementPage;