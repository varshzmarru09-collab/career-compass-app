import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { NavigationProvider, useNavigation } from './context/NavigationContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { WelcomePage } from './pages/WelcomePage.js';
import { AuthPage } from './pages/AuthPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { CareerSetupPage } from './pages/CareerSetupPage.js';
import { SkillAnalyzerPage } from './pages/SkillAnalyzerPage.js';
import { RoadmapPage } from './pages/RoadmapPage.js';
import { TrainingPage } from './pages/TrainingPage.js';
import { JobsPage } from './pages/JobsPage.js';
import { ApplicationsPage } from './pages/ApplicationsPage.js';
import { MySkillsPage } from './pages/MySkillsPage.js';
import { ProfilePage } from './pages/ProfilePage.js';

function MainApp() {
  const { user, profile, isLoading } = useAuth();
  const { currentRoute, routeParams, navigate, goBack } = useNavigation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-semibold tracking-wide text-slate-300">
          Initializing Career Compass Engine...
        </div>
      </div>
    );
  }

  // 1. Unauthenticated Student State:
  if (!user) {
    if (currentRoute === 'auth' || currentRoute === 'login') {
      return (
        <AuthPage
          onSuccess={() => {
            // If user has no profile or no sector/desired role, navigate to career-setup onboarding
            if (!profile || !profile.sector || !profile.desiredRole) {
              navigate('career-setup');
            } else {
              navigate('dashboard');
            }
          }}
          onBack={() => goBack('welcome')}
        />
      );
    }

    // Default unauthenticated view: Welcome landing
    return <WelcomePage onGetStarted={() => navigate('auth')} />;
  }

  // 2. Authenticated Student Flow:
  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'career-setup':
        return (
          <CareerSetupPage
            onContinue={() => navigate('analyzer')}
            onBack={() => goBack('dashboard')}
            onNavigateTab={(tab) => navigate(tab)}
          />
        );

      case 'analyzer':
      case 'skill-analyzer':
        return (
          <SkillAnalyzerPage
            onNavigateTab={(tab) => navigate(tab)}
            onBack={() => goBack('career-setup')}
          />
        );

      case 'roadmap':
      case 'progress':
        return (
          <RoadmapPage
            onNavigateTab={(tab) => navigate(tab)}
            onBack={() => goBack('analyzer')}
          />
        );

      case 'training':
      case 'courses':
        return (
          <TrainingPage
            onNavigateTab={(tab) => navigate(tab)}
            onBack={() => goBack('analyzer')}
          />
        );

      case 'jobs':
      case 'job':
        return (
          <JobsPage
            onNavigateTab={(tab, params) => navigate(tab, params)}
            onBack={() => goBack('analyzer')}
            initialApplyJobId={routeParams?.applyJobId || routeParams?.apply}
          />
        );

      case 'application':
      case 'apply':
        return (
          <JobsPage
            onNavigateTab={(tab, params) => navigate(tab, params)}
            onBack={() => goBack('jobs')}
            initialApplyJobId={routeParams?.applyJobId || routeParams?.apply || routeParams?.jobId}
          />
        );

      case 'applications':
      case 'tracking':
        return (
          <ApplicationsPage
            onNavigateTab={(tab) => navigate(tab)}
            onBack={() => goBack('jobs')}
          />
        );

      case 'skills':
        return (
          <MySkillsPage
            onNavigateTab={(tab) => navigate(tab)}
            onBack={() => goBack('dashboard')}
          />
        );

      case 'profile':
        return (
          <ProfilePage
            onNavigateTab={(tab) => navigate(tab)}
            onBack={() => goBack('dashboard')}
          />
        );

      case 'dashboard':
      default:
        return (
          <DashboardPage
            onNavigateTab={(tab) => navigate(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar
        currentTab={currentRoute}
        onNavigate={(tab) => navigate(tab)}
      />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <MainApp />
      </NavigationProvider>
    </AuthProvider>
  );
}
