import { useEffect, useState, useCallback } from "react";
import AdminLogin from "./Login";
import AdminDashboard from "./Dashboard";

interface AdminUser {
  authenticated: boolean;
}

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/me", {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      // En algunos deploys Vercel/CDN puede responder 304.
      // 304 NO trae body; si intentamos json() rompe.
      if (response.status === 304) {
        // Si llegó 304, asumimos que la sesión existe pero la respuesta fue cacheada.
        // Igual vamos a marcarlo como autenticado para dejarte entrar.
        setUser({ authenticated: true });
        return;
      }

      if (response.ok) {
        // Si el backend devuelve JSON válido
        const data = await response.json().catch(() => null);

        // Si por cualquier motivo el body no vino, pero ok=true, asumimos sesión válida
        if (!data) {
          setUser({ authenticated: true });
          return;
        }

        setUser(data);
      } else {
        setUser({ authenticated: false });
      }
    } catch (error) {
      setUser({ authenticated: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const handleLoginSuccess = () => {
    setIsLoading(true);
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
