import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import PublishingDashboard from './PublishingDashboard';
import Books from './Books';
import Authors from './Authors';
import AuthorDetail from './AuthorDetail';
import Sales from './Sales';
import Stores from './Stores';
import { AuthContext } from '../../context/AuthContext';
import { Role } from '../../types';

const PublishingManagementPage: React.FC = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    if (user && ![Role.ADMIN, Role.BOOK_AUTHOR].includes(user.role)) {
        return <Navigate to="/home" replace />;
    }
    
    const getTitle = () => {
        const path = location.pathname.split('/publishing/')[1] || 'dashboard';
        const authorIdMatch = path.match(new RegExp('^authors/([^/]+)'));

        if (authorIdMatch) return 'Author Details';

        switch(path) {
            case 'dashboard': return 'Publishing Dashboard';
            case 'books': return 'Manage Books';
            case 'authors': return 'Manage Authors';
            case 'sales': return 'Sales Analytics';
            case 'stores': return 'Store Distribution';
            default: return 'Publishing Management';
        }
    };

    const navLinks = [
        { path: 'dashboard', label: 'Dashboard', icon: '📊' },
        { path: 'books', label: 'Books', icon: '📖' },
        { path: 'authors', label: 'Authors', icon: '✍️' },
        { path: 'sales', label: 'Sales', icon: '💰' },
        { path: 'stores', label: 'Stores', icon: '🏪' },
    ];

    const PublishingHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/publishing/${link.path}`)
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
                    {!location.pathname.includes('/authors/') && <PublishingHeader />}
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<PublishingDashboard />} />
                            <Route path="books" element={<Books />} />
                            <Route path="authors" element={<Authors />} />
                            <Route path="authors/:authorId" element={<AuthorDetail />} />
                            <Route path="sales" element={<Sales />} />
                            <Route path="stores" element={<Stores />} />
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default PublishingManagementPage;