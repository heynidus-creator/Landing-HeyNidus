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
    if (isInView) {
      const direction = scrollDirectionRef.current;

      if (direction === "down") {
        // Scroll hacia abajo → entra desde arriba con slide + rotate
        setAnimationClass("slide-rotate-in-down");
      } else if (direction === "up") {
        // Scroll hacia arriba → entra desde abajo con slide + rotate inverso
        setAnimationClass("slide-rotate-in-up");
      } else {
        // Primer render / sin dirección clara → usamos el efecto “down” por defecto
        setAnimationClass("slide-rotate-in-down");
      }
    } else {
      // Cuando sale de vista, reseteamos la clase para que la animación
      // vuelva a ejecutarse la próxima vez que entre al viewport
      setAnimationClass("");
    }
  }, [isInView, scrollDirectionRef]);

  return (
    <div ref={ref} id={id} className={`${animationClass} ${className}`}>
      {children}
    </div>
  );
};
