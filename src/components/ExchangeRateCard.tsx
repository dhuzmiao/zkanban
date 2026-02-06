import { ExchangeRateData } from '@/types';
import { formatPrice, formatPercent, getColorClass } from '@/utils/formatters';
import { TradingStatus } from './ui/TradingStatus';
import { PriceFlash } from './ui/PriceFlash';
import { usePriceChange } from '@/hooks/usePriceChange';

interface ExchangeRateCardProps {
  data: ExchangeRateData;
}

/**
 * 汇率卡片组件 - 暗色赛博金融终端风格
 */
export function ExchangeRateCard({ data }: ExchangeRateCardProps) {
  const { name, price, change, changePercent, baseCurrency, quoteCurrency, lastUpdate } = data;
  const colorClass = getColorClass(change);
  const priceChange = usePriceChange(price);

  // 外汇市场24/5交易（周一至周五）
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const isTrading = dayOfWeek >= 1 && dayOfWeek <= 5; // 周一到周五

  // 格式化更新时间
  const formatUpdateTime = (utcString: string) => {
    try {
      const date = new Date(utcString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return utcString;
    }
  };

  return (
    <div className="relative glass-card rounded-lg overflow-hidden group hover:border-white/20 transition-all duration-200">
      {/* 左侧状态条 */}
      <TradingStatus isTrading={isTrading} />

      {/* 价格闪烁效果 */}
      <PriceFlash changeDirection={priceChange}>
        <div className="p-4 pl-6">
          {/* 头部：名称和价格 */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-green to-emerald-600 flex items-center justify-center">
                  <span className="text-xs">💱</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{name}</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-500">
                {baseCurrency}/{quoteCurrency}
              </p>
            </div>
            <div className={`text-2xl font-mono font-bold ${colorClass} animate-digit-scroll`}>
              {formatPrice(price)}
            </div>
          </div>

          {/* 涨跌信息 */}
          <div className="flex items-center space-x-3">
            <span className={`text-lg font-medium ${colorClass}`}>
              {formatPercent(changePercent)}
            </span>
            <span className={`text-sm ${colorClass} font-mono`}>
              {change >= 0 ? '+' : ''}{formatPrice(change, 4)}
            </span>
          </div>

          {/* 更新时间 */}
          {lastUpdate && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-600">
              更新: {formatUpdateTime(lastUpdate)}
            </div>
          )}
        </div>
      </PriceFlash>
    </div>
  );
}
