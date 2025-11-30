import { useEffect, useRef } from "react";

/**
 * Devuelve un ref con la última dirección de scroll:
 * 'down' | 'up' | 'none'
 */
export const useScrollDirection = () => {
  const directionRef = useRef<"down" | "up" | "none">("none");
  const lastScrollYRef = useRef<number>(window.scrollY || 0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      const diff = currentY - lastScrollYRef.current;

      if (Math.abs(diff) < 2) return; // ruido pequeño, lo ignoramos

      if (diff > 0) {
        directionRef.current = "down";
      } else if (diff < 0) {
        directionRef.current = "up";
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return directionRef;
};
