import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, FileText, MessageSquare, Users, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onLogoutSuccess: () => void;
}

export default function AdminDashboard({ onLogoutSuccess }: AdminDashboardProps) {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      toast({
        title: 'Sesión cerrada',
        description: 'Has salido correctamente',
      });

      onLogoutSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cerrar sesión',
        variant: 'destructive',
      });
    }
  };

  const menuItems = [
    {
      title: 'Proyectos',
      description: 'Gestiona los proyectos disponibles',
      icon: FileText,
      href: '/admin/proyectos',
      testid: 'card-menu-proyectos',
    },
    {
      title: 'Blog',
      description: 'Administra posts y artículos',
      icon: MessageSquare,
      href: '/admin/blog',
      testid: 'card-menu-blog',
    },
    {
      title: 'Testimonios',
      description: 'Gestiona testimonios de clientes',
      icon: Users,
      href: '/admin/testimonios',
      testid: 'card-menu-testimonios',
    },
    {
      title: 'Analytics',
      description: 'Visualiza métricas del sitio',
      icon: BarChart3,
      href: '/admin/analytics',
      testid: 'card-menu-analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Panel Admin
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Gestiona tu sitio HeyNidus
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                data-testid={item.testid}
              >
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {item.description}
                        </CardDescription>
                      </div>
                      <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Click para acceder →
                    </p>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            <a
              href="/"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
              data-testid="link-back-home-dashboard"
            >
              Volver a la landing
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
