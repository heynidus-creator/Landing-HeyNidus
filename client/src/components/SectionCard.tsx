import { ReactNode } from 'react';
import { useViewportAnimation } from '../hooks/useViewportAnimation';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const SectionCard = ({
  children,
  className = '',
  id,
}: SectionCardProps) => {
  const { ref, isInView } = useViewportAnimation();
  const scrollDirectionRef = useScrollDirection();

  const getAnimationClass = () => {
    if (!isInView) return '';
    const direction = scrollDirectionRef.current;
    
    if (direction === 'down') {
      return 'animate-fade-in-up';
    } else if (direction === 'up') {
      return 'animate-fade-in-down';
    }
    return 'animate-fade-in-up';
  };

  return (
    <div
      ref={ref}
      id={id}
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
};
