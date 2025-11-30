import { ReactNode, useEffect, useState } from "react";
import { useViewportAnimation } from "../hooks/useViewportAnimation";
import { useScrollDirection } from "../hooks/useScrollDirection";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const SectionCard = ({
  children,
  className = "",
  id,
}: SectionCardProps) => {
  const { ref, isInView } = useViewportAnimation();
  const scrollDirectionRef = useScrollDirection();
  const [animationClass, setAnimationClass] = useState<string>("");

  useEffect(() => {
    // Si la tarjeta NO está en vista → reseteamos animación
    if (!isInView) {
      setAnimationClass("");
      return;
    }

    const direction = scrollDirectionRef.current;

    // Al cargar la página todavía no hay dirección de scroll:
    // no animamos el primer render (Hero quieto al entrar).
    if (direction === "none") {
      setAnimationClass("");
      return;
    }

    // Si venís bajando → animación desde arriba
    if (direction === "down") {
      setAnimationClass("section-anim-down");
      return;
    }

    // Si venís subiendo → animación invertida
    if (direction === "up") {
      setAnimationClass("section-anim-up");
      return;
    }
  }, [isInView, scrollDirectionRef]);

  return (
    <div
      ref={ref}
      id={id}
      className={`section-anim-base ${animationClass} ${className}`}
    >
      {children}
    </div>
  );
};
