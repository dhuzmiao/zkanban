import { GoldData } from '@/types';
import { formatPrice, formatPercent, getColorClass } from '@/utils/formatters';
import { TradingStatus } from './ui/TradingStatus';
import { PriceFlash } from './ui/PriceFlash';
import { usePriceChange } from '@/hooks/usePriceChange';
import { checkIfGoldTrading } from '@/utils/tradingHours';

interface GoldCardProps {
  data: GoldData;
}

/**
 * 黄金卡片组件 - 暗色赛博金融终端风格
 */
export function GoldCard({ data }: GoldCardProps) {
  const { name, price, change, changePercent } = data;
  const colorClass = getColorClass(change);
  const priceChange = usePriceChange(price);
  const isTrading = checkIfGoldTrading();

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
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-gold to-yellow-600 flex items-center justify-center">
                  <span className="text-xs">🪙</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{name}</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-500">国内金价</p>
            </div>
            <div className={`text-2xl font-mono font-bold ${colorClass} animate-digit-scroll`}>
              ¥{formatPrice(price)}
            </div>
          </div>

          {/* 涨跌信息 */}
          <div className="flex items-center space-x-3">
            <span className={`text-lg font-medium ${colorClass}`}>
              {formatPercent(changePercent)}
            </span>
            <span className={`text-sm ${colorClass} font-mono`}>
              {change >= 0 ? '+' : ''}{formatPrice(change, 2)}
            </span>
          </div>
        </div>
      </PriceFlash>
    </div>
  );
}
