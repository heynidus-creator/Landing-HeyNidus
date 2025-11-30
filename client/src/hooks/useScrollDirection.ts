import { useEffect, useRef } from "react";

type ScrollDirection = "up" | "down" | null;

/**
 * Hook global y liviano para saber si el usuario está scrolleando
 * hacia ARRIBA o hacia ABAJO.
 *
 * - Devuelve un ref con el valor actual:
 *   ref.current === "up"   | "down" | null
 */
export const useScrollDirection = () => {
  const directionRef = useRef<ScrollDirection>(null);
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;

      const delta = currentY - lastY;

      // pequeño umbral para evitar ruido
      if (Math.abs(delta) < 2) return;

      if (delta > 0) {
        directionRef.current = "down";
      } else if (delta < 0) {
        directionRef.current = "up";
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return directionRef;
};
