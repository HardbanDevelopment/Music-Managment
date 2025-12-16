import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuspenseLoader from '@/components/ui/SuspenseLoader';
import DashboardPage from '@/pages/DashboardPage';
import { Role, User } from '@/types';
import ComingSoonPage from '@/pages/ComingSoonPage';

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const MusicManagementPage = React.lazy(() => import('@/pages/music/MusicManagementPage'));
const PublishingManagementPage = React.lazy(() => import('@/pages/publishing/PublishingManagementPage'));
const EcommerceManagementPage = React.lazy(() => import('@/pages/ecommerce/EcommerceManagementPage'));
const FinancesManagementPage = React.lazy(() => import('@/pages/finances/FinancesManagementPage'));
const MarketingManagementPage = React.lazy(() => import('@/pages/marketing/MarketingManagementPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));
const StrategyManagementPage = React.lazy(() => import('@/pages/strategy/StrategyManagementPage'));
const CollaborationManagementPage = React.lazy(() => import('@/pages/collaboration/CollaborationManagementPage'));
const CreativeLabManagementPage = React.lazy(() => import('@/pages/creative/CreativeLabManagementPage'));
const FanHubManagementPage = React.lazy(() => import('@/pages/fanhub/FanHubManagementPage'));
const PrometheusGenesisPage = React.lazy(() => import('@/pages/prometheus/PrometheusGenesisPage'));

interface AppRoutesProps {
  user: User | null;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ user }) => {
  const getDashboardTitle = () => {
    if (!user) return 'Dashboard';
    switch (user.role) {
      case Role.ADMIN:
        return 'Admin Dashboard';
      case Role.MUSIC_CREATOR:
        return 'Creator Dashboard';
      case Role.BOOK_AUTHOR:
        return 'Author Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><SuspenseLoader /></div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<DashboardPage title={getDashboardTitle()} component={<HomePage />} />} />
        <Route path="/music/*" element={<MusicManagementPage />} />
        <Route path="/publishing/*" element={<PublishingManagementPage />} />
        <Route path="/ecommerce/*" element={<EcommerceManagementPage />} />
        <Route path="/fanhub/*" element={<FanHubManagementPage />} />
        <Route path="/finances/*" element={<FinancesManagementPage />} />
        <Route path="/marketing/*" element={<MarketingManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/analytics/*" element={<AnalyticsPage />} />
        <Route path="/strategy/*" element={<StrategyManagementPage />} />
        <Route path="/creative/*" element={<CreativeLabManagementPage />} />
        <Route path="/prometheus/*" element={<PrometheusGenesisPage />} />
        {/* Fallback for any other marketing pages not explicitly defined */}
        <Route path="/marketing/*" element={<ComingSoonPage title="Marketing Tool" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
