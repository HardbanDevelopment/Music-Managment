import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Tutorial from '@/components/onboarding/Tutorial';
import { Role } from '@/types';

interface MainLayoutProps {
  children: ReactNode;
  showTutorialFor: Role | null;
  onCloseTutorial: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showTutorialFor, onCloseTutorial }) => {
  return (
    <>
      {showTutorialFor && <Tutorial role={showTutorialFor} onClose={onCloseTutorial} />}
      <div className="flex bg-dark-bg min-h-screen text-gray-200">
        <Sidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayout;
