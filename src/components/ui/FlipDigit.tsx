import { useState, useEffect } from 'react';

interface FlipDigitProps {
  value: number;
}

export function FlipDigit({ value }: FlipDigitProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setCurrentValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, currentValue]);

  return (
    <div className="flip-digit relative w-12 h-16 font-mono font-bold text-4xl rounded overflow-hidden shadow-lg flex items-center justify-center">
      <div className={isFlipping ? 'animate-flip' : ''}>
        {currentValue}
      </div>
    </div>
  );
}
