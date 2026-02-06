import { CryptoData } from '@/types';

/**
 * Gate.io API 端点
 * 使用代理路径避免 CORS 问题
 */
const GATE_API_BASE = '/api/gate/api2/1';

/**
 * 获取 Gate.io 加密货币行情数据
 * API: https://data.gateapi.io/api2/1/ticker/btc_usdt
 *
 * 返回格式:
 * {
 *   "last": "70622.2",
 *   "high24hr": "76786.5",
 *   "low24hr": "70122",
 *   "percentChange": "-7.45",
 *   "baseVolume": "12345.67"
 * }
 */
export async function fetchGateCryptoData(symbol: string = 'btc_usdt'): Promise<CryptoData | null> {
  try {
    const url = `${GATE_API_BASE}/ticker/${symbol}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return parseGateTickerData(symbol, data);
  } catch (error) {
    console.error('Failed to fetch Gate.io crypto data:', error);
    return null;
  }
}

/**
 * 解析 Gate.io Ticker 数据
 */
function parseGateTickerData(symbol: string, data: any): CryptoData | null {
  try {
    const price = parseFloat(data.last);
    const change24h = parseFloat(data.percentChange);
    const changePercent24h = parseFloat(data.percentChange);

    if (isNaN(price)) return null;

    // 映射交易对到显示名称
    const nameMap: Record<string, string> = {
      'btc_usdt': '比特币',
      'eth_usdt': '以太坊'
    };

    const symbolMap: Record<string, string> = {
      'btc_usdt': 'BTC',
      'eth_usdt': 'ETH'
    };

    return {
      symbol: symbolMap[symbol] || symbol.split('_')[0].toUpperCase(),
      name: nameMap[symbol] || symbol.split('_')[0].toUpperCase(),
      price,
      change24h: (price * change24h / 100), // 将百分比转换为绝对值
      changePercent24h,
      updateTime: Date.now()
    };
  } catch (error) {
    console.error('Failed to parse Gate.io ticker data:', error);
    return null;
  }
}
