import { useEffect, useRef, useState } from "react";

/**
 * Detecta si la sección está "bien dentro" del viewport.
 * Lo usamos para disparar la animación cada vez que entra
 * y la reseteamos cuando sale.
 */
export const useViewportAnimation = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Consideramos "en vista" cuando al menos ~35% de la tarjeta es visible
          const visible = entry.intersectionRatio >= 0.35;
          setIsInView(visible);
        });
      },
      {
        threshold: [0, 0.35, 1],
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};
