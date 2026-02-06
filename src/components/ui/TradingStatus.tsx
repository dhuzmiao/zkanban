import { cn } from '@/utils/cn';

interface TradingStatusProps {
  isTrading: boolean;
  className?: string;
}

/**
 * 交易状态指示器组件
 * 显示左侧状态条，交易中时显示绿色脉冲，已停止时显示灰色
 */
export function TradingStatus({ isTrading, className }: TradingStatusProps) {
  return (
    <div
      className={cn(
        'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
        isTrading
          ? 'bg-neon-green status-trading'
          : 'bg-status-stopped',
        className
      )}
    />
  );
}
