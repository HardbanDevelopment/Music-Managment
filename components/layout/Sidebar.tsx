
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Role } from '../../types';
import { SharedIcons } from '../common/Icons';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end={to === '/home'}
    className={({ isActive }) =>
      `flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary-purple text-white shadow-lg'
          : 'text-gray-400 hover:bg-dark-card hover:text-white'
      }`
    }
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </NavLink>
);

const NavSection: React.FC<{title: string}> = ({ title }) => (
    <h2 className="px-4 pt-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h2>
);

const Sidebar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  const allNavItems = [
    { section: 'Platform', to: '/home', icon: <SharedIcons.Home />, label: 'Dashboard', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Prometheus Genesis', to: '/prometheus/orchestrator', icon: <SharedIcons.Workflow />, label: 'Workflow Orchestrator', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Prometheus Genesis', to: '/prometheus/immersive', icon: <SharedIcons.VR />, label: 'Immersive Lab (AR/VR)', roles: [Role.ADMIN, Role.MUSIC_CREATOR] },
    { section: 'Distribution', to: '/music/dashboard', icon: <SharedIcons.Music />, label: 'Music', roles: [Role.ADMIN, Role.MUSIC_CREATOR] },
    { section: 'Distribution', to: '/publishing/dashboard', icon: <SharedIcons.Publishing />, label: 'Publishing', roles: [Role.ADMIN, Role.BOOK_AUTHOR] },
    { section: 'E-commerce', to: '/ecommerce/dashboard', icon: <SharedIcons.Store />, label: 'Store', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Fan Engagement', to: '/fanhub/dashboard', icon: <SharedIcons.FanHub />, label: 'Fan Hub', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Finances', to: '/finances/wallet', icon: <SharedIcons.Wallet />, label: 'Wallet', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Finances', to: '/finances/forecasting', icon: <SharedIcons.Forecast />, label: 'Forecasting', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Analytics', to: '/analytics/audience-hub', icon: <SharedIcons.Analytics />, label: 'Audience Hub', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Analytics', to: '/analytics/catalogue-audit', icon: <SharedIcons.Audit />, label: 'Catalogue Audit', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Strategy', to: '/strategy/goals', icon: <SharedIcons.Strategy />, label: 'Goals Hub', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Strategy', to: '/strategy/opportunity-finder', icon: <SharedIcons.Opportunity />, label: 'Opportunity Finder', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Strategy', to: '/strategy/brand-sentinel', icon: <SharedIcons.Shield />, label: 'Brand Sentinel', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Creative', to: '/creative/feedback', icon: <SharedIcons.Creative />, label: 'AI Feedback Loop', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Collaboration', to: '/collaboration/finder', icon: <SharedIcons.Collaboration />, label: 'Collaboration Lab', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/campaigns', icon: <SharedIcons.Campaigns />, label: 'Campaigns', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/ai-strategist', icon: <SharedIcons.Strategist />, label: 'AI Strategist', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/calendar', icon: <SharedIcons.Calendar />, label: 'Calendar', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/social-media', icon: <SharedIcons.SocialMedia />, label: 'Social Media', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/media-monitoring', icon: <SharedIcons.MediaMonitoring />, label: 'Media Monitoring', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/creative-studio', icon: <SharedIcons.CreativeStudio />, label: 'Creative Studio', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/press-release', icon: <SharedIcons.PressRelease />, label: 'Press Release', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/contacts', icon: <SharedIcons.Contacts />, label: 'Contacts', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/content-library', icon: <SharedIcons.ContentLibrary />, label: 'Content Library', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/smart-links', icon: <SharedIcons.SmartLink />, label: 'Smart Links', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Marketing & Promotion', to: '/marketing/ai-studio', icon: <SharedIcons.AIStudio />, label: 'AI Studio', roles: [Role.ADMIN, Role.MUSIC_CREATOR] },
    { section: 'Marketing & Promotion', to: '/marketing/ai-assistant', icon: <SharedIcons.AIAssistant />, label: 'AI Assistant', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
    { section: 'Platform', to: '/settings', icon: <SharedIcons.Settings />, label: 'Settings', roles: [Role.ADMIN, Role.MUSIC_CREATOR, Role.BOOK_AUTHOR] },
  ];

  const navItems = user ? allNavItems.filter(item => item.roles.includes(user.role)) : [];
  
  const groupedNav = navItems.reduce((acc, item) => {
    acc[item.section] = acc[item.section] || [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  const sectionOrder = ['Platform', 'Prometheus Genesis', 'Distribution', 'E-commerce', 'Fan Engagement', 'Finances', 'Analytics', 'Strategy', 'Creative', 'Collaboration', 'Marketing & Promotion'];


  return (
    <aside className="w-64 bg-dark-bg border-r border-dark-border flex flex-col p-4 fixed h-full overflow-y-auto">
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          Hardban<span className="text-primary-purple">Records Lab</span>
        </h1>
      </div>
      <nav className="flex-1 space-y-2 mt-2">
        {sectionOrder.map(section => {
            const items = groupedNav[section];
            if (!items) return null;
            return (
                <div key={section}>
                    <NavSection title={section} />
                    {items.map((item) => (
                        <NavItem key={item.to} to={item.to} icon={item.icon} label={user?.role === Role.ADMIN ? item.label : item.label.replace('Music', 'My Music').replace('Publishing', 'My Books').replace('Store', 'My Store')} />
                    ))}
                </div>
            );
        })}
      </nav>
      <div className="mt-auto pt-4">
         <button
            onClick={logout}
            className="flex items-center space-x-4 px-4 py-3 rounded-lg w-full text-gray-400 hover:bg-dark-card hover:text-error-red transition-colors"
        >
            <SharedIcons.Logout />
            <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
