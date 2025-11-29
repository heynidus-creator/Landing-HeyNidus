import { useState } from 'react';
import { useLocation } from 'wouter';
import birdIcon from '@assets/image_1763966603851.png';

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

  const handleNavClick = (sectionId: string) => {
    setOpen(false);
    
    // Si estamos en una ruta de proyecto, primero ir a home
    if (location.startsWith('/proyecto')) {
      window.history.pushState({}, '', '/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      // Si ya estamos en home, solo hacer scroll
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
    <header className="fixed inset-x-0 top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button 
          onClick={handleLogoClick}
          className="relative inline-block text-2xl font-semibold tracking-tight text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer bg-none border-none p-0"
          data-testid="button-logo"
        >
          <span className="relative">
            HeyNidus
            <img src={birdIcon} alt="bird" className="absolute w-7 h-7 -top-3 -right-7" data-testid="img-bird-logo" style={{marginTop: '-2px'}} />
          </span>
        </button>

        {/* Desktop */}
        <div className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors bg-none border-none cursor-pointer p-0"
              data-testid={`button-nav-${link.href}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile button */}
        <button
          className="inline-flex items-center justify-center rounded-md border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <span className="text-lg">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors bg-none border-none cursor-pointer p-0 text-left"
                data-testid={`button-mobile-nav-${link.href}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
