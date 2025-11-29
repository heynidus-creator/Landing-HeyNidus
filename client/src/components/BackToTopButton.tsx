import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 50) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-20 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 animate-fade-in"
          aria-label="Volver al inicio"
          title="Volver al inicio"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
