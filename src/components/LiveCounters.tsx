import React, { useState, useEffect, useRef } from 'react';

interface LiveCounterProps {
  emoji: string;
  label: string;
  type: 'visitors' | 'bookings' | 'automations';
}

const LiveCounter: React.FC<LiveCounterProps> = ({ emoji, label, type }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  // Get initial value based on type
  const getInitialValue = (type: string) => {
    switch (type) {
      case 'visitors':
        return 15847; // Base number for visitors
      case 'bookings':
        return 2341; // Base number for bookings
      case 'automations':
        return 786; // Base number for automations
      default:
        return 0;
    }
  };

  // Calculate current value based on type
  const getCurrentValue = (type: string, baseValue: number) => {
    const now = new Date();
    const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    
    switch (type) {
      case 'visitors':
        // Increase by 1 per visit (simulated with time-based increment)
        return baseValue + Math.floor(now.getTime() / (1000 * 60 * 5)); // +1 every 5 minutes
      case 'bookings':
        // Increase by random 1-5 every 14 days
        const bookingCycles = Math.floor(daysSinceEpoch / 14);
        const bookingIncrease = bookingCycles * (Math.floor(Math.random() * 5) + 1);
        return baseValue + bookingIncrease;
      case 'automations':
        // Increase by random 1-3 every 14 days
        const automationCycles = Math.floor(daysSinceEpoch / 14);
        const automationIncrease = automationCycles * (Math.floor(Math.random() * 3) + 1);
        return baseValue + automationIncrease;
      default:
        return baseValue;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const baseValue = getInitialValue(type);
            const targetValue = getCurrentValue(type, baseValue);
            const startTime = Date.now();
            const duration = 3000;
            
            const updateCount = () => {
              const now = Date.now();
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function for smooth animation
              const easeOutCubic = 1 - Math.pow(1 - progress, 3);
              const currentValue = Math.floor(baseValue + (targetValue - baseValue) * easeOutCubic);
              
              setCount(currentValue);
              
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                setCount(targetValue);
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
  }, [type, hasAnimated]);

  return (
    <div 
      ref={counterRef}
      className="flex flex-col items-center p-6 bg-background/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 group"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {emoji}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-[#00B8A9] mb-2 group-hover:text-primary transition-colors duration-300">
        {count.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground text-center font-medium">
        {label}
      </div>
    </div>
  );
};

const LiveCounters: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 reveal-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#222831]">
            📈 Real Results in Motion
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Live data from businesses we're currently transforming
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <LiveCounter 
            emoji="👥"
            label="Monthly Visitors"
            type="visitors"
          />
          <LiveCounter 
            emoji="📆"
            label="Bookings Created"
            type="bookings"
          />
          <LiveCounter 
            emoji="⚙️"
            label="Automations Deployed"
            type="automations"
          />
        </div>
      </div>
    </section>
  );
};

export default LiveCounters;