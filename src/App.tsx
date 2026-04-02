import { Toaster } from 'sonner';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Policies } from './components/Policies';
import { usePayhub } from './hooks/use-payhub';
import { useState, useEffect } from 'react';
import { log_crash } from './services/crashReporting';
import { track_event, onboard_user } from './services/analytics';

type ViewState = 'dashboard' | 'policies';

function App() {
  const { isLoggedIn, user } = usePayhub();
  const [view, setView] = useState<ViewState>('dashboard');

  const handleShowPolicies = () => {
    track_event(user, 'view_policies');
    setView('policies');
  };
  
  const handleGoHome = () => {
    track_event(user, 'view_dashboard');
    setView('dashboard');
  };

  // 🛡️ Crash Reporting - Catch global errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      log_crash(event.error || event.message);
    };
    
    const handleRejection = (event: PromiseRejectionEvent) => {
      log_crash(event.reason || 'Unhandled Promise Rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // 📊 Analytics & Onboarding
  useEffect(() => {
    if (isLoggedIn && user) {
      const isAlreadyOnboarded = localStorage.getItem(`onboarded_${user.email}`) === 'true';
      if (!isAlreadyOnboarded) {
        onboard_user(user);
        track_event(user, 'first_time_login');
      } else {
        track_event(user, 'returning_login');
      }
    }
  }, [isLoggedIn, user]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <Toaster position="top-center" richColors closeButton />
      {!isLoggedIn ? (
        <Auth />
      ) : view === 'policies' ? (
        <Policies onBack={handleGoHome} />
      ) : (
        <Dashboard onShowPolicies={handleShowPolicies} />
      )}
    </div>
  );
}

export default App;