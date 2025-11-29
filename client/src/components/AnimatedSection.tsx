import { ReactNode } from 'react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'none';
  className?: string;
  delay?: number;
}

export const AnimatedSection = ({
  children,
  animation = 'fade-up',
  className = '',
  delay = 0,
}: AnimatedSectionProps) => {
  const { ref, isInView } = useInViewAnimation();

  const animationMap: Record<string, string> = {
    'fade-up': 'animate-fade-in-up',
    'fade-down': 'animate-fade-in-down',
    'fade-left': 'animate-fade-in-left',
    'fade-right': 'animate-fade-in-right',
    scale: 'animate-scale-in',
    none: '',
  };

  const delayClass = delay > 0 ? `stagger-${Math.min(Math.ceil(delay * 10), 5)}` : '';
  const animClass = isInView ? animationMap[animation] : '';

  return (
    <div
      ref={ref}
      className={`${animClass} ${delayClass} ${className}`}
      style={delay > 0 ? { animationDelay: `${delay}s` } : {}}
    >
      {children}
    </div>
  );
};
