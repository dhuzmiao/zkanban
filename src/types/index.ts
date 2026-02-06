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

// 白银数据
export interface SilverData extends MarketData {}

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
  silver: SilverData | null;
  crypto: Record<string, CryptoData>;
  exchangeRate: ExchangeRateData | null;
  lastUpdate: number;
}

// 看板操作
export interface DashboardActions {
  updateStock: (symbol: string, data: StockData) => void;
  updateGold: (data: GoldData) => void;
  updateSilver: (data: SilverData) => void;
  updateCrypto: (symbol: string, data: CryptoData) => void;
  updateExchangeRate: (data: ExchangeRateData) => void;
  setLastUpdate: (time: number) => void;
}

// ==================== WebSocket 类型 ====================

/**
 * Finnhub WebSocket 连接状态
 */
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Finnhub WebSocket 消息类型
 */
export interface FinnhubMessage {
  type: 'ping' | 'trade' | 'news' | 'error';
  data?: Array<{
    s: string; // symbol
    p: number; // price
    v: number; // volume
    t: number; // timestamp
  }>;
}

/**
 * Finnhub WebSocket 订阅消息
 */
export interface FinnhubSubscribeMessage {
  type: 'subscribe';
  symbol: string;
}

/**
 * WebSocket 数据源类型
 */
export type DataSource = 'websocket' | 'rest-api';

/**
 * WebSocket Hook 返回值
 */
export interface UseFinnhubWebSocketResult {
  rate: number | null;
  status: ConnectionState;
  isConnected: boolean;
  error: Error | null;
}
