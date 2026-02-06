import { StockData } from '@/types';
import { formatPrice, formatPercent, getColorClass } from '@/utils/formatters';
import { TradingStatus } from './ui/TradingStatus';
import { PriceFlash } from './ui/PriceFlash';
import { usePriceChange } from '@/hooks/usePriceChange';
import { checkIfStockTrading } from '@/utils/tradingHours';

interface StockCardProps {
  data: StockData;
}

/**
 * 股票卡片组件 - 暗色赛博金融终端风格
 */
export function StockCard({ data }: StockCardProps) {
  const { name, price, change, changePercent, open, prevClose, turnoverRate } = data;
  const colorClass = getColorClass(change);
  const priceChange = usePriceChange(price);
  const isTrading = checkIfStockTrading();

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

          {/* 涨跌信息 */}
          <div className="flex items-center space-x-3 mb-4">
            <span className={`text-lg font-medium ${colorClass}`}>
              {formatPercent(changePercent)}
            </span>
            <span className={`text-sm ${colorClass} font-mono`}>
              {change >= 0 ? '+' : ''}{formatPrice(change, 3)}
            </span>
          </div>

          {/* 已收盘标签 - 移到价格下方，不被覆盖 */}
          {!isTrading && (
            <div className="mb-2">
              <span className="px-2 py-1 text-xs bg-status-stopped/20 text-status-stopped rounded">
                已收盘
              </span>
            </div>
          )}

          {/* 详细信息 */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 dark:text-gray-400 border-t border-black/5 dark:border-white/5 pt-3">
            <div>
              <span className="text-gray-600 dark:text-gray-500">开盘:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300 font-mono">{formatPrice(open)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-500">昨收:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300 font-mono">{formatPrice(prevClose)}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600 dark:text-gray-500">换手率:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300 font-mono">{turnoverRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </PriceFlash>
    </div>
  );
}
