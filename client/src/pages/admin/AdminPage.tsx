import { useEffect, useState } from 'react';
import AdminLogin from './Login';
import AdminDashboard from './Dashboard';

interface AdminUser {
  authenticated: boolean;
}

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/admin/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser({ authenticated: false });
      }
    } catch (error) {
      setUser({ authenticated: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    verifyAuth();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user?.authenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard onLogoutSuccess={handleLoginSuccess} />;
}
