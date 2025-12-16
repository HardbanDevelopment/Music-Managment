import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import ProjectFinderPage from './ProjectFinderPage';
import MyProjectsPage from './MyProjectsPage';

const CollaborationManagementPage: React.FC = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname.split('/collaboration/')[1] || 'finder';
        switch(path) {
            case 'finder': return 'Collaboration Lab: Project Finder';
            case 'projects': return 'My Collaboration Projects';
            default: return 'Collaboration';
        }
    };

    const navLinks = [
        { path: 'finder', label: 'Project Finder', icon: '🔍' },
        { path: 'projects', label: 'My Projects', icon: '📁' },
    ];

    const CollaborationHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/collaboration/${link.path}`)
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
                    <CollaborationHeader />
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="finder" replace />} />
                            <Route path="finder" element={<ProjectFinderPage />} />
                            <Route path="projects" element={<MyProjectsPage />} />
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default CollaborationManagementPage;