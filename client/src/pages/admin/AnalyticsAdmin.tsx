import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Eye, Clock, Users, TrendingUp } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok, SiGoogle, SiYoutube, SiX } from 'react-icons/si';

interface AnalyticsSummary {
  totalViews: number;
  totalSeconds: number;
  avgSecondsPerView: number;
  byPage: Record<string, { views: number; seconds: number }>;
  byProject: Record<string, { views: number; seconds: number; name?: string }>;
  bySource: Record<string, number>;
  byDay: Record<string, { views: number; seconds: number }>;
}

const sourceIcons: Record<string, JSX.Element> = {
  facebook: <SiFacebook className="w-4 h-4 text-blue-600" />,
  instagram: <SiInstagram className="w-4 h-4 text-pink-500" />,
  tiktok: <SiTiktok className="w-4 h-4" />,
  google: <SiGoogle className="w-4 h-4 text-red-500" />,
  youtube: <SiYoutube className="w-4 h-4 text-red-600" />,
  twitter: <SiX className="w-4 h-4" />,
};

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export default function AnalyticsAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me', { credentials: 'include' });
      if (!response.ok) {
        navigate('/admin');
        return;
      }
      loadAnalytics();
    } catch {
      navigate('/admin');
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/summary', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar analytics', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto text-center py-12 text-slate-500">
          No hay datos de analytics disponibles.
        </div>
      </div>
    );
  }

  const sortedProjects = Object.entries(summary.byProject)
    .sort(([, a], [, b]) => b.views - a.views)
    .slice(0, 10);

  const sortedSources = Object.entries(summary.bySource)
    .sort(([, a], [, b]) => b - a);

  const sortedPages = Object.entries(summary.byPage)
    .sort(([, a], [, b]) => b.views - a.views)
    .slice(0, 10);

  const sortedDays = Object.entries(summary.byDay)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} data-testid="button-back-admin">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Métricas de visitas y engagement</p>
          </div>
          <Button variant="outline" onClick={loadAnalytics} data-testid="button-refresh-analytics">
            Actualizar
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{summary.totalViews}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Visitas totales</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatTime(summary.totalSeconds)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tiempo total</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatTime(summary.avgSecondsPerView)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tiempo promedio</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{Object.keys(summary.bySource).length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Fuentes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Proyectos por Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedProjects.length > 0 ? (
                <div className="space-y-3">
                  {sortedProjects.map(([projectId, data]) => (
                    <div key={projectId} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{data.name || `Proyecto ${projectId}`}</p>
                        <p className="text-xs text-slate-500">{formatTime(data.seconds / data.views)} promedio</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">{data.views}</p>
                        <p className="text-xs text-slate-500">visitas</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">Sin datos de proyectos</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fuentes de Tráfico</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedSources.length > 0 ? (
                <div className="space-y-3">
                  {sortedSources.map(([source, views]) => (
                    <div key={source} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {sourceIcons[source] || <Users className="w-4 h-4 text-slate-400" />}
                        <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">{source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{views}</span>
                        <span className="text-xs text-slate-500">({Math.round((views / summary.totalViews) * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">Sin datos de fuentes</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Páginas más visitadas</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedPages.length > 0 ? (
                <div className="space-y-3">
                  {sortedPages.map(([page, data]) => (
                    <div key={page} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{page === '/' ? 'Home' : page}</p>
                        <p className="text-xs text-slate-500">{formatTime(data.seconds / data.views)} promedio</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">{data.views}</p>
                        <p className="text-xs text-slate-500">visitas</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">Sin datos de páginas</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Últimos 7 días</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedDays.length > 0 ? (
                <div className="space-y-3">
                  {sortedDays.map(([day, data]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{day}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{formatTime(data.seconds)}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.views} visitas</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">Sin datos recientes</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Cómo probar Analytics</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p>1. Abre la web con parámetros UTM: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">?utm_source=instagram</code></p>
            <p>2. Navega por diferentes páginas y proyectos</p>
            <p>3. Espera al menos 30 segundos o cierra la pestaña</p>
            <p>4. Vuelve aquí y presiona "Actualizar" para ver las métricas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
