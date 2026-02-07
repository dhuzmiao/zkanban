/**
 * 腾讯财经 API - 美股数据服务
 * API: http://qt.gtimg.cn/q=指数代码
 * 返回格式: v_usDJI="200~道琼斯~.DJI~当前价~昨收~今开~最高~最低~..."
 */

import { StockData } from '@/types';

// 美股指数配置
const US_INDICES = {
  us_dji: '道琼斯工业平均指数',
  us_ixic: '纳斯达克综合指数',
  us_spx: '标普500指数'
} as const;

// 美股个股配置
const US_STOCKS = {
  us_nvda: '英伟达',
  us_googl: '谷歌-A',
  us_aapl: '苹果',
  us_tsla: '特斯拉'
} as const;

// 腾讯财经指数代码映射
const TENCENT_INDEX_SYMBOLS: Record<string, string> = {
  us_dji: 'usDJI',
  us_ixic: 'usIXIC',
  us_spx: 'usINX'
};

// 腾讯财经个股代码映射
const TENCENT_STOCK_SYMBOLS: Record<string, string> = {
  us_nvda: 'usNVDA',
  us_googl: 'usGOOGL',
  us_aapl: 'usAAPL',
  us_tsla: 'usTSLA'
};

/**
 * 获取腾讯美股数据（指数+个股）
 */
async function fetchTencentUSData(): Promise<Record<string, string>> {
  const indexSymbols = Object.values(TENCENT_INDEX_SYMBOLS).join(',');
  const stockSymbols = Object.values(TENCENT_STOCK_SYMBOLS).join(',');
  const allSymbols = `${indexSymbols},${stockSymbols}`;
  const url = `/api/qt/q=${allSymbols}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  // 获取原始 ArrayBuffer 并使用 GBK 解码器
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder('gbk');
  const text = decoder.decode(buffer);

  return parseTencentResponse(text);
}

/**
 * 解析腾讯API响应
 * 匹配 v_usXXX="..." 格式
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
 * 解析腾讯美股数据
 * 数据格式: "200~名称~代码~当前价~昨收~今开~最高~最低~..."
 * 索引:        0   1    2    3     4    5    6    7
 *
 * 注意：索引4是昨收，索引5是今开
 */
function parseTencentUSData(
  tencentSymbol: string,
  ourSymbol: string,
  name: string
): StockData | null {
  try {
    const parts = tencentSymbol.split('~');
    if (parts.length < 8) return null;

    const price = parseFloat(parts[3]);      // 当前价（索引3）
    const prevClose = parseFloat(parts[4]);  // 昨收（索引4）
    const open = parseFloat(parts[5]);       // 今开（索引5）
    // high/low 数据暂未使用，按需扩展

    if (isNaN(price) || isNaN(prevClose) || prevClose === 0) return null;

    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;

    return {
      symbol: ourSymbol,
      name,
      price,
      change,
      changePercent,
      open,
      prevClose,
      turnoverRate: 0,
      updateTime: Date.now()
    };
  } catch (error) {
    console.error('Failed to parse Tencent US data:', error);
    return null;
  }
}

/**
 * 获取美股数据（指数+个股）
 */
export async function fetchUSIndicesData(): Promise<Record<string, StockData>> {
  try {
    console.log('[US Data] 开始获取美股数据 (腾讯财经)...');

    const response = await fetchTencentUSData();
    const result: Record<string, StockData> = {};

    // 解析指数数据
    for (const [ourSymbol, tencentSymbol] of Object.entries(TENCENT_INDEX_SYMBOLS)) {
      const data = response[tencentSymbol];
      if (data) {
        const parsed = parseTencentUSData(
          data,
          ourSymbol,
          US_INDICES[ourSymbol as keyof typeof US_INDICES]
        );
        if (parsed) {
          result[ourSymbol] = parsed;
        }
      }
    }

    // 解析个股数据
    for (const [ourSymbol, tencentSymbol] of Object.entries(TENCENT_STOCK_SYMBOLS)) {
      const data = response[tencentSymbol];
      if (data) {
        const parsed = parseTencentUSData(
          data,
          ourSymbol,
          US_STOCKS[ourSymbol as keyof typeof US_STOCKS]
        );
        if (parsed) {
          result[ourSymbol] = parsed;
        }
      }
    }

    console.log('[US Data] 最终结果:', Object.keys(result));
    return result;
  } catch (error) {
    console.error('Failed to fetch US data:', error);
    return {};
  }
}
