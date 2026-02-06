import { CryptoData } from '@/types';
import { formatPrice, formatPercent, getColorClass } from '@/utils/formatters';
import { TradingStatus } from './ui/TradingStatus';
import { PriceFlash } from './ui/PriceFlash';
import { usePriceChange } from '@/hooks/usePriceChange';
import { checkIfCryptoTrading } from '@/utils/tradingHours';

interface CryptoCardProps {
  data: CryptoData;
}

/**
 * 加密货币卡片组件 - 暗色赛博金融终端风格
 */
export function CryptoCard({ data }: CryptoCardProps) {
  const { name, price, change24h, changePercent24h, symbol } = data;
  const colorClass = getColorClass(change24h);
  const priceChange = usePriceChange(price);
  const isTrading = checkIfCryptoTrading();

  // 不同币种的图标和渐变色配置
  const coinConfig: Record<string, { icon: string; from: string; to: string }> = {
    'BTC': { icon: '₿', from: 'from-orange-400', to: 'to-orange-600' },
    'ETH': { icon: 'Ξ', from: 'from-blue-400', to: 'to-purple-600' },
    'SOL': { icon: '◎', from: 'from-teal-400', to: 'to-cyan-600' }
  };

  const config = coinConfig[symbol] || coinConfig['BTC'];

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
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${config.from} ${config.to} flex items-center justify-center`}>
                  <span className="text-xs font-bold">{config.icon}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-600 dark:text-gray-500 font-mono">{symbol}/USDT</p>
                {/* 实时指示器 */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">实时</span>
              </div>
            </div>
            <div className={`text-2xl font-mono font-bold ${colorClass} animate-digit-scroll`}>
              ${formatPrice(price, 2)}
            </div>
          </div>

          {/* 涨跌信息 */}
          <div className="flex items-center space-x-3">
            <span className={`text-lg font-medium ${colorClass}`}>
              {formatPercent(changePercent24h)}
            </span>
            <span className={`text-sm ${colorClass} font-mono`}>
              {change24h >= 0 ? '+' : ''}{formatPrice(change24h, 2)}
            </span>
            <span className="text-xs text-gray-500 ml-auto">24h</span>
          </div>
        </div>
      </PriceFlash>
    </div>
  );
}
