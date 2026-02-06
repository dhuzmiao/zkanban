import { useState, useEffect, useRef } from 'react';

/**
 * 价格变化检测 Hook
 * 检测价格变化方向并返回变化类型
 */
export function usePriceChange(price: number) {
  const prevPriceRef = useRef(price);
  const [changeDirection, setChangeDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (price !== prevPriceRef.current) {
      setChangeDirection(price > prevPriceRef.current ? 'up' : 'down');
      prevPriceRef.current = price;

      // 500ms后清除变化标记
      const timer = setTimeout(() => setChangeDirection(null), 500);
      return () => clearTimeout(timer);
    }
  }, [price]);

  return changeDirection;
}
