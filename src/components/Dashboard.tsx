import { useDashboardStore } from '@/store/useDashboardStore';
import { useStockData, useGoldData, useCryptoData, useExchangeRateData } from '@/hooks';
import { StockCard } from './StockCard';
import { GoldCard } from './GoldCard';
import { CryptoCard } from './CryptoCard';
import { ExchangeRateCard } from './ExchangeRateCard';
import { FlipClock } from './ui/FlipClock';
import { PriceFlash } from './ui/PriceFlash';
import { useState, useEffect } from 'react';
import { StockData } from '@/types';
import { formatPrice, formatPercent, getColorClass } from '@/utils/formatters';
import { usePriceChange } from '@/hooks/usePriceChange';

interface SectionProps {
  title: string;
  icon: string;
  borderColor: string;
  children: React.ReactNode;
  indices?: StockData[];
}

/**
 * 股指横向展示条 - 单行紧凑格式
 * 格式: 上证 3245.67 +1.23% | 深证 10234.56 -0.45% | ...
 */
function IndexTicker({ indices }: { indices: StockData[] }) {
  // 按固定顺序排序
  const sortedIndices = [...indices].sort((a, b) => {
    const order: Record<string, number> = {
      'sh000001': 1,
      'sz399001': 2,
      'sz399006': 3
    };
    return (order[a.symbol] || 99) - (order[b.symbol] || 99);
  });

  return (
    <div className="hidden md:flex items-center space-x-3 text-sm">
      {sortedIndices.map((index, i) => {
        const colorClass = getColorClass(index.change);
        const priceChange = usePriceChange(index.price);

        return (
          <PriceFlash key={index.symbol} changeDirection={priceChange} className="rounded px-1.5 py-0.5 -mx-1.5">
            <div className="flex items-center space-x-1.5">
              {i > 0 && <span className="text-gray-500">|</span>}
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {index.name}
              </span>
              <span className={`font-mono font-semibold ${colorClass} animate-digit-scroll`}>
                {formatPrice(index.price)}
              </span>
              <span className={`font-mono text-xs ${colorClass}`}>
                {formatPercent(index.changePercent)}
              </span>
            </div>
          </PriceFlash>
        );
      })}
    </div>
  );
}

/**
 * 分区容器组件 - 霓虹边框效果
 */
function Section({ title, icon, borderColor, children, indices }: SectionProps) {
  return (
    <section className="mb-10">
      {/* 分区标题 - 霓虹边框 */}
      <div className={`flex items-center justify-between mb-4 pl-4 pr-4 ${borderColor}`}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {indices && indices.length > 0 && <IndexTicker indices={indices} />}
      </div>

      {/* 分区内容 - 玻璃态背景 */}
      <div className="glass-section rounded-lg p-5">
        {children}
      </div>
    </section>
  );
}

/**
 * 实时数据看板主容器 - 暗色赛博金融终端风格
 */
export function Dashboard() {
  // 启动数据获取
  useStockData();
  useGoldData();
  useCryptoData();
  useExchangeRateData();

  const { stocks, gold, crypto, exchangeRate } = useDashboardStore();

  // 当前时间（北京时区 UTC+8），每秒更新
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stockList = Object.values(stocks);
  const cryptoList = Object.values(crypto);

  // 分离指数和个股
  const indexSymbols = ['sh000001', 'sz399001', 'sz399006'];
  const indices = stockList.filter(stock => indexSymbols.includes(stock.symbol));
  const individualStocks = stockList.filter(stock => !indexSymbols.includes(stock.symbol));

  return (
    <div className="min-h-screen bg-deep-space bg-grid-pattern p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">
              实时交易终端
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              股票 · 贵金属 · 数字资产 · 外汇
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              北京时间 (UTC+8)
            </div>
            <FlipClock timestamp={currentTime} />
          </div>
        </div>

        {/* 卡片网格 - 分类显示 */}
        <div>
          {/* 股票分区 */}
          {(indices.length > 0 || individualStocks.length > 0) && (
            <Section
              title="股票市场"
              icon="📈"
              borderColor="neon-border-purple"
              indices={indices}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* 个股卡片 */}
                {individualStocks.map((stock) => (
                  <StockCard key={stock.symbol} data={stock} />
                ))}
              </div>
            </Section>
          )}

          {/* 黄金分区 */}
          {gold && (
            <Section
              title="贵金属"
              icon="🪙"
              borderColor="neon-border-gold"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <GoldCard data={gold} />
              </div>
            </Section>
          )}

          {/* 数字货币分区 */}
          {cryptoList.length > 0 && (
            <Section
              title="数字资产"
              icon="₿"
              borderColor="neon-border-cyan"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cryptoList.map((data) => (
                  <CryptoCard key={data.symbol} data={data} />
                ))}
              </div>
            </Section>
          )}

          {/* 外汇市场分区 */}
          {exchangeRate && (
            <Section
              title="外汇市场"
              icon="💱"
              borderColor="neon-border-green"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <ExchangeRateCard data={exchangeRate} />
              </div>
            </Section>
          )}
        </div>

        {/* 空状态 */}
        {stockList.length === 0 && !gold && cryptoList.length === 0 && !exchangeRate && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
            <p className="mt-6 text-gray-600 dark:text-gray-400">正在加载数据...</p>
          </div>
        )}

        {/* 数据源说明 */}
        <div className="mt-12 pt-6 border-t border-black/5 dark:border-white/5">
          <div className="text-xs text-gray-600 dark:text-gray-500 text-center space-y-1">
            <p>数据来源: 腾讯财经API · 新浪黄金 · Gold-API实时金价 · Gate.io · ExchangeRate-API</p>
            <p>更新频率: 股票3秒 · 黄金5秒 · 加密货币实时 · 汇率1小时</p>
          </div>
        </div>
      </div>
    </div>
  );
}
