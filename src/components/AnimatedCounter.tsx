import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  emoji?: string;
  label: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  end, 
  duration = 3000, 
  emoji, 
  label 
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const startTime = Date.now();
            const startValue = 0;
            
            const updateCount = () => {
              const now = Date.now();
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              const easeOutCubic = 1 - Math.pow(1 - progress, 3);
              const currentValue = Math.floor(startValue + (end - startValue) * easeOutCubic);
              
              setCount(currentValue);
              
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                setCount(end);
              }
            };
            
            requestAnimationFrame(updateCount);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <div 
      ref={counterRef}
      className="flex flex-col items-center p-8"
    >
      {emoji && (
        <div className="text-3xl mb-4">
          {emoji}
        </div>
      )}
      <div className="text-5xl md:text-6xl font-extralight text-foreground mb-3 tracking-tight">
        {count.toLocaleString()}+
      </div>
      <div className="text-sm text-muted-foreground text-center tracking-wider uppercase">
        {label}
      </div>
    </div>
  );
};

export default AnimatedCounter;
