import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface PriceFlashProps {
  children: ReactNode;
  changeDirection: 'up' | 'down' | null;
  className?: string;
}

/**
 * 价格闪烁动画包装器
 * 当价格变化时显示背景闪烁效果
 */
export function PriceFlash({ children, changeDirection, className }: PriceFlashProps) {
  const flashClass =
    changeDirection === 'up' ? 'animate-flash-rise' :
    changeDirection === 'down' ? 'animate-flash-fall' : '';

  return (
    <div className={cn('rounded-lg transition-colors duration-300', flashClass, className)}>
      {children}
    </div>
  );
}
