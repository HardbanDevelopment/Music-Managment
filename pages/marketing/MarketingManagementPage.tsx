import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import SmartLinksPage from './SmartLinksPage';
import AIStudioPage from './AIStudioPage';
import CreativeStudioPage from './CreativeStudioPage';
import PressReleasePage from './PressReleasePage';
import ContactsPage from './ContactsPage';
import CampaignsPage from './CampaignsPage';
import SocialMediaPage from './SocialMediaPage';
import CalendarPage from './CalendarPage';
import MediaMonitoringPage from './MediaMonitoringPage';
import AIAssistantPage from './AIAssistantPage';
import ContentLibraryPage from './ContentLibraryPage';
const AICampaignStrategistPage = React.lazy(() => import('./AICampaignStrategistPage'));

const MarketingManagementPage: React.FC = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname.split('/marketing/')[1] || 'analytics';
        switch(path) {
            case 'smart-links': return 'Smart Links';
            case 'ai-studio': return 'AI Studio';
            case 'creative-studio': return 'AI Creative Studio';
            case 'press-release': return 'Press Releases';
            case 'contacts': return 'Contacts CRM';
            case 'campaigns': return 'Campaigns';
            case 'social-media': return 'Social Media';
            case 'calendar': return 'Marketing Calendar';
            case 'media-monitoring': return 'Media Monitoring';
            case 'ai-assistant': return 'AI Assistant';
            case 'content-library': return 'Content Library';
            case 'ai-strategist': return 'AI Campaign Strategist';
            default: return 'Marketing & Promotion';
        }
    };

    return (
        <DashboardPage 
            title={getTitle()} 
            component={
                <Routes>
                    <Route path="/" element={<Navigate to="campaigns" replace />} />
                    <Route path="smart-links" element={<SmartLinksPage />} />
                    <Route path="ai-studio" element={<AIStudioPage />} />
                    <Route path="creative-studio" element={<CreativeStudioPage />} />
                    <Route path="press-release" element={<PressReleasePage />} />
                    <Route path="contacts" element={<ContactsPage />} />
                    <Route path="campaigns" element={<CampaignsPage />} />
                    <Route path="social-media" element={<SocialMediaPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="media-monitoring" element={<MediaMonitoringPage />} />
                    <Route path="ai-assistant" element={<AIAssistantPage />} />
                    <Route path="content-library" element={<ContentLibraryPage />} />
                    <Route path="ai-strategist" element={<AICampaignStrategistPage />} />
                </Routes>
            }
        />
    );
};

export default MarketingManagementPage;
