import { useState } from 'react';
import { useLocation } from 'wouter';
import ThemeToggle from './ThemeToggle';
import { useScrollSpy } from '../hooks/useScrollSpy';

const navLinks = [
  { label: 'Inicio', href: 'inicio' },
  { label: 'Quiénes Somos', href: 'quienes-somos' },
  { label: 'Proyectos', href: 'proyectos' },
  { label: 'Blog', href: 'blog' },
  { label: 'Testimonios', href: 'testimonios' },
  { label: 'Contacto', href: 'contacto' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const sectionIds = navLinks.map(link => link.href);
  const activeSection = useScrollSpy({ sectionIds, offset: 100 });

  const handleNavClick = (sectionId: string) => {
    setOpen(false);
    
    if (location.startsWith('/proyecto')) {
      window.history.pushState({}, '', '/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = () => {
    setOpen(false);
    if (location.startsWith('/proyecto')) {
      window.history.pushState({}, '', '/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700 w-full">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-4 py-2 w-full">
        <button 
          onClick={handleLogoClick}
          className="flex items-center hover:opacity-80 transition-opacity cursor-pointer bg-none border-none p-0 flex-shrink-0 group"
          data-testid="button-logo"
        >
          <img 
            src="/heynidus-logo.png" 
            alt="HeyNidus" 
            className="h-14 sm:h-16 w-auto dark:brightness-0 dark:invert"
            data-testid="img-logo"
          />
        </button>

        {/* Desktop */}
        <div className="hidden gap-4 md:gap-6 md:flex items-center">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-medium transition-colors bg-none border-none cursor-pointer p-0 pb-1 border-b-2 ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 border-emerald-700 dark:border-emerald-400'
                    : 'text-slate-700 dark:text-slate-300 border-transparent hover:text-emerald-700 dark:hover:text-emerald-400'
                }`}
                data-testid={`button-nav-${link.href}`}
              >
                {link.label}
              </button>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 sm:gap-2 md:hidden flex-shrink-0">
          <ThemeToggle />
          <button
            className="inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
            data-testid="button-hamburger"
          >
            <span className="text-lg">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 md:hidden w-full">
          <div className="mx-auto flex max-w-6xl flex-col px-3 sm:px-4 py-3 space-y-2 w-full">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-medium transition-colors bg-none border-none cursor-pointer p-2 text-left rounded-md ${
                    isActive
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400'
                  }`}
                  data-testid={`button-mobile-nav-${link.href}`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
