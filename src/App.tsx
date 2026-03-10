import { useState, useEffect, useMemo } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Dashboard } from './components/Dashboard';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';

export type Page = 'landing' | 'login' | 'signup' | 'dashboard' | 'verify-email' | 'forgot-password' | 'reset-password';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  organization?: {
    name?: string;
    type?: string;
  };
  profile?: {
    avatar?: string;
    phone?: string;
  };
}

export default function App() {
  // Simplified state - only track what's necessary
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Calculate initial page during render instead of useEffect
    const urlParams = new URLSearchParams(window.location.search);
    if (window.location.pathname === '/verify-email' || urlParams.get('verify')) {
      return 'verify-email';
    } else if (window.location.pathname === '/reset-password' || urlParams.get('reset')) {
      return 'reset-password';
    }
    return 'landing';
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize authentication state to avoid unnecessary re-renders
  const isLoggedIn = useMemo(() => !!user, [user]);

  // Simplified authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Quick auth check with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setUser(data.data.user);
        setCurrentPage('dashboard');
      } else {
        localStorage.removeItem('token');
      }
    })
    .catch(() => {
      localStorage.removeItem('token');
    })
    .finally(() => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('landing');
  };

  // Memoize the current page component to prevent unnecessary re-renders - MUST be before early return
  const currentPageComponent = useMemo(() => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onNavigate={setCurrentPage}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            user={user}
          />
        );
      case 'login':
        return (
          <LoginPage
            onNavigate={setCurrentPage}
            onLogin={handleLogin}
          />
        );
      case 'signup':
        return (
          <SignupPage
            onNavigate={setCurrentPage}
          />
        );
      case 'dashboard':
        return isLoggedIn ? (
          <Dashboard
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
            user={user}
          />
        ) : (
          <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />
        );
      case 'verify-email':
        return (
          <VerifyEmailPage
            onNavigate={setCurrentPage}
            onLogin={handleLogin}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onNavigate={setCurrentPage}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordPage
            onNavigate={setCurrentPage}
          />
        );
      default:
        return (
          <LandingPage
            onNavigate={setCurrentPage}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            user={user}
          />
        );
    }
  }, [currentPage, isLoggedIn, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentPageComponent}
    </div>
  );
}
