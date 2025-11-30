import { useEffect, useRef, useState } from "react";

/**
 * Detecta cuándo una sección entra / sale del viewport.
 * - ref: se asigna al contenedor de la sección
 * - isInView: true si la sección está visible
 * - triggerId: se incrementa cada vez que VUELVE a entrar, para reiniciar animaciones
 */
export const useViewportAnimation = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [triggerId, setTriggerId] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== el) return;

          if (entry.isIntersecting) {
            setIsInView(true);
            // Cada vez que entra de nuevo al viewport, subimos el contador
            setTriggerId((prev) => prev + 1);
          } else {
            setIsInView(false);
          }
        });
      },
      {
        threshold: 0.35, // con ~35% visible ya cuenta como "en vista"
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView, triggerId };
};
