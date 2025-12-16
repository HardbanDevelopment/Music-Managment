import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, ToastProvider } from '@/providers/AppProviders';
import { AuthContext } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import AppRoutes from '@/routes/AppRoutes';
import OnboardingPage from '@/pages/OnboardingPage';
import ToastContainer from '@/components/ui/Toast';
import './index.css';

const AppContent: React.FC = () => {
  const { user, showTutorialFor, setShowTutorialFor } = useContext(AuthContext);

  if (!user) {
    return <OnboardingPage />;
  }

  return (
    <MainLayout showTutorialFor={showTutorialFor} onCloseTutorial={() => setShowTutorialFor(null)}>
      <AppRoutes user={user} />
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
