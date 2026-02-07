import { StockData } from '@/types';
import { formatPrice, formatPercent, getColorClass } from '@/utils/formatters';
import { TradingStatus } from './ui/TradingStatus';
import { PriceFlash } from './ui/PriceFlash';
import { usePriceChange } from '@/hooks/usePriceChange';
import { checkIfStockTrading, checkIfUSMarketTrading } from '@/utils/tradingHours';

interface StockCardProps {
  data: StockData;
}

/**
 * 美股符号前缀（指数+个股）
 */
const US_SYMBOL_PREFIXES = ['us_dji', 'us_ixic', 'us_spx', 'us_nvda', 'us_googl', 'us_aapl', 'us_tsla'];

/**
 * 判断是否为美股
 */
function isUSStock(symbol: string): boolean {
  return US_SYMBOL_PREFIXES.some(prefix => symbol.startsWith(prefix));
}

/**
 * 股票卡片组件 - 暗色赛博金融终端风格
 */
export function StockCard({ data }: StockCardProps) {
  const { name, price, change, changePercent } = data;
  const colorClass = getColorClass(change);
  const priceChange = usePriceChange(price);

  // 根据symbol判断使用哪个交易时间检查函数
  const isTrading = isUSStock(data.symbol)
    ? checkIfUSMarketTrading()
    : checkIfStockTrading();

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
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-500 font-mono">{data.symbol}</p>
            </div>
            <div className={`text-2xl font-mono font-bold ${colorClass} animate-digit-scroll`}>
              {formatPrice(price)}
            </div>
          </div>

          {/* 涨跌信息 + 已收盘状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`text-lg font-medium ${colorClass}`}>
                {formatPercent(changePercent)}
              </span>
              <span className={`text-sm ${colorClass} font-mono`}>
                {change >= 0 ? '+' : ''}{formatPrice(change, 3)}
              </span>
            </div>
            {!isTrading && (
              <span className="px-2 py-0.5 text-xs bg-status-stopped/20 text-status-stopped rounded">
                已收盘
              </span>
            )}
          </div>
        </div>
      </PriceFlash>
    </div>
  );
}
