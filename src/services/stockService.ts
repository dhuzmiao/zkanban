import { StockData } from '@/types';

/**
 * 腾讯财经股票 API 符号配置
 */
const STOCK_SYMBOLS = {
  sh000001: '上证指数',
  sz399001: '深证成指',
  sz399006: '创业板指',
  sh601318: '中国平安',
  sh512000: '券商ETF'
};

/**
 * 获取腾讯股票数据
 * API: http://qt.gtimg.cn/q=sh000001,sh601318,sh512880
 * 返回格式: v_sh000001="1~上证指数~000001~4072.35~4102.20~4075.03~455899198~..."
 */
async function fetchTencentStockData(symbols: string): Promise<Record<string, string>> {
  try {
    // 使用代理路径避免 CORS 问题
    let url = `/api/qt/q=${symbols}`;

    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 获取原始 ArrayBuffer 并使用 GBK 解码器
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(buffer);

    return parseTencentResponse(text);
  } catch (error) {
    console.error('Failed to fetch Tencent stock data:', error);
    throw error;
  }
}

/**
 * 解析腾讯API响应
 * 匹配 v_sh000001="1~上证指数~000001~..." 格式
 */
function parseTencentResponse(text: string): Record<string, string> {
  const result: Record<string, string> = {};

  // 匹配 v_XXX="..." 格式
  const regex = /v_(\w+)\s*=\s*"([^"]*)"/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const symbol = match[1];
    const data = match[2];
    result[symbol] = data;
  }

  return result;
}

/**
 * 解析腾讯股票数据
 * 数据格式: "1~上证指数~000001~当前价~昨收~今开~最高~最低~成交量~..."
 * 索引:        0   1      2      3     4    5    6    7    8      38(换手率)
 *
 * 注意：索引4是昨收，索引5是今开（与常见认知相反，这是腾讯API的格式）
 */
function parseTencentStockData(symbol: string, data: string): StockData | null {
  try {
    const parts = data.split('~');
    if (parts.length < 39) return null;  // 需要更多字段以获取换手率

    const name = parts[1];
    const price = parseFloat(parts[3]);      // 当前价（索引3）
    const prevClose = parseFloat(parts[4]);  // 昨收（索引4）
    const open = parseFloat(parts[5]);       // 今开（索引5）
    const turnoverRate = parseFloat(parts[38]); // 换手率（索引38）

    if (isNaN(price) || isNaN(prevClose) || prevClose === 0) return null;

    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;

    return {
      symbol,
      name,
      price,
      change,
      changePercent,
      open,
      prevClose,
      turnoverRate: isNaN(turnoverRate) ? 0 : turnoverRate,
      updateTime: Date.now()
    };
  } catch (error) {
    console.error('Failed to parse Tencent stock data:', error);
    return null;
  }
}

/**
 * 获取股票数据
 */
export async function fetchStockData(): Promise<Record<string, StockData>> {
  try {
    const symbols = Object.keys(STOCK_SYMBOLS).join(',');
    const response = await fetchTencentStockData(symbols);

    const result: Record<string, StockData> = {};

    for (const [symbol] of Object.entries(STOCK_SYMBOLS)) {
      const data = response[symbol];
      if (data) {
        const parsed = parseTencentStockData(symbol, data);
        if (parsed) {
          result[symbol] = parsed;
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    return {};
  }
}
