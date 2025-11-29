import { useEffect, useRef } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export const useScrollDirection = () => {
  const lastScrollY = useRef(0);
  const directionRef = useRef<ScrollDirection>(null);

  useEffect(() => {
    let animationId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current) {
          directionRef.current = 'down';
        } else if (currentScrollY < lastScrollY.current) {
          directionRef.current = 'up';
        }
        lastScrollY.current = currentScrollY;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return directionRef;
};
