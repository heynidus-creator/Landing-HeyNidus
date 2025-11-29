import { useState, useEffect, useRef } from 'react';

interface UseViewportAnimationOptions extends IntersectionObserverInit {
  onEnter?: () => void;
  onExit?: () => void;
}

export const useViewportAnimation = (options?: UseViewportAnimationOptions) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const { onEnter, onExit, ...observerOptions } = options || {};

  useEffect(() => {
    const config: IntersectionObserverInit = {
      threshold: 0.1,
      ...observerOptions,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        onEnter?.();
      } else {
        setIsInView(false);
        onExit?.();
      }
    }, config);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onEnter, onExit, observerOptions]);

  return { ref, isInView };
};
