// 基础数据接口
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  updateTime: number;
}

// 股票数据
export interface StockData extends MarketData {
  open: number;          // 今开
  prevClose: number;     // 昨收
  turnoverRate: number;  // 换手率(%)
}

// 黄金数据
export interface GoldData extends MarketData {}

// 加密货币数据
export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  updateTime: number;
}

// 汇率数据
export interface ExchangeRateData extends MarketData {
  baseCurrency: string;      // 基础货币 (USD)
  quoteCurrency: string;     // 目标货币 (CNH)
  rate: number;              // 汇率值
  lastUpdate: string;        // UTC时间字符串
}

// 看板状态
export interface DashboardState {
  stocks: Record<string, StockData>;
  gold: GoldData | null;
  crypto: Record<string, CryptoData>;
  exchangeRate: ExchangeRateData | null;
  lastUpdate: number;
}

// 看板操作
export interface DashboardActions {
  updateStock: (symbol: string, data: StockData) => void;
  updateGold: (data: GoldData) => void;
  updateCrypto: (data: CryptoData) => void;
  updateExchangeRate: (data: ExchangeRateData) => void;
  setLastUpdate: (time: number) => void;
}
