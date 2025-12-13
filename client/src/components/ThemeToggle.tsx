import { useEffect, useState } from 'react';
import { Sun, Moon, CloudMoon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark' | 'rest';

const themeConfig = {
  light: { icon: Sun, label: 'Día', title: 'Tema claro' },
  dark: { icon: Moon, label: 'Noche', title: 'Tema oscuro' },
  rest: { icon: CloudMoon, label: 'Descanso', title: 'Tema descanso' },
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && ['light', 'dark', 'rest'].includes(storedTheme)) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme: Theme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      applyTheme(systemTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'rest');
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'rest') {
      root.classList.add('rest');
    }
  };

  const selectTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  const CurrentIcon = themeConfig[theme].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-700 dark:text-slate-300 rest:text-slate-300"
          aria-label="Seleccionar tema"
          data-testid="button-theme-dropdown"
        >
          <CurrentIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {(Object.keys(themeConfig) as Theme[]).map((t) => {
          const config = themeConfig[t];
          const Icon = config.icon;
          const isActive = theme === t;
          return (
            <DropdownMenuItem
              key={t}
              onClick={() => selectTheme(t)}
              className={`flex items-center gap-2 cursor-pointer ${isActive ? 'bg-accent' : ''}`}
              data-testid={`menu-theme-${t}`}
            >
              <Icon className="w-4 h-4" />
              <span>{config.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
