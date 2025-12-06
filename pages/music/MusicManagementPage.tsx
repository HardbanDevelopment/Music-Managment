import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import MusicDashboard from './MusicDashboard';
import Releases from './Releases';
import Artists from './Artists';
import ArtistDetail from './ArtistDetail';
import Royalties from './Royalties';
import Distribution from './Distribution';
import { AuthContext } from '../../context/AuthContext';
import { Role } from '../../types';

const MusicManagementPage: React.FC = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    if (user && ![Role.ADMIN, Role.MUSIC_CREATOR].includes(user.role)) {
        return <Navigate to="/home" replace />;
    }
    
    const getTitle = () => {
        const path = location.pathname.split('/music/')[1] || 'dashboard';
        const artistIdMatch = path.match(new RegExp('^artists/([^/]+)'));

        if (artistIdMatch) return 'Artist Details';

        switch(path) {
            case 'dashboard': return 'Music Dashboard';
            case 'releases': return 'Manage Releases';
            case 'artists': return 'Manage Artists';
            case 'royalties': return 'Royalties';
            case 'distribution': return 'Distribution';
            default: return 'Music Management';
        }
    };

    const navLinks = [
        { path: 'dashboard', label: 'Dashboard', icon: '📊' },
        { path: 'releases', label: 'Releases', icon: '🎵' },
        { path: 'artists', label: 'Artists', icon: '👥' },
        { path: 'royalties', label: 'Royalties', icon: '💰' },
        { path: 'distribution', label: 'Distribution', icon: '🌎' },
    ];

    const MusicHeader = () => (
         <div className="flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <nav className="flex space-x-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname.includes(`/music/${link.path}`)
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
                    {!location.pathname.includes('/artists/') && <MusicHeader />}
                    <div className="pt-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<MusicDashboard />} />
                            <Route path="releases" element={<Releases />} />
                            <Route path="artists" element={<Artists />} />
                            <Route path="artists/:artistId" element={<ArtistDetail />} />
                            <Route path="royalties" element={<Royalties />} />
                            <Route path="distribution" element={<Distribution />} />
                        </Routes>
                    </div>
                </div>
            }
        />
    );
};

export default MusicManagementPage;