import { GoldData } from '@/types';

/**
 * 腾讯财经黄金ETF API
 * sh518880: 黄金ETF，每份约对应0.01克黄金
 */
const GOLD_ETF_SYMBOL = 'sh518880';
const GOLD_ETF_URL = `/api/qt/q=${GOLD_ETF_SYMBOL}`;

/**
 * 常量定义
 * 黄金ETF每份 ≈ 0.01克黄金
 */
const GRAMS_PER_ETF_SHARE = 0.01;

/**
 * 缓存
 */
let cachedData: GoldData | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 10000; // 10秒缓存

/**
 * 解析腾讯黄金ETF数据
 * 格式: v_sh518880="1~黄金ETF~518880~当前价~昨收~今开~..."
 */
function parseGoldETFData(text: string): { price: number; change: number; changePercent: number } | null {
  try {
    const regex = /v_sh518880\s*=\s*"([^"]*)"/;
    const match = text.match(regex);
    if (!match) return null;

    const parts = match[1].split('~');
    if (parts.length < 6) return null;

    const price = parseFloat(parts[3]);      // 当前价（索引3）
    const prevClose = parseFloat(parts[4]);  // 昨收（索引4）
    // const open = parseFloat(parts[5]);       // 今开（索引5）- 暂未使用

    if (isNaN(price) || isNaN(prevClose) || prevClose === 0) return null;

    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;

    return { price, change, changePercent };
  } catch (error) {
    console.error('Failed to parse gold ETF data:', error);
    return null;
  }
}

/**
 * 转换为人民币/克价格
 * 黄金ETF价格(人民币/0.01克) → 人民币/克
 */
function convertToCNYPerGram(etfPriceCNY: number): number {
  return etfPriceCNY / GRAMS_PER_ETF_SHARE;  // 除以0.01
}

/**
 * 获取黄金数据
 * 直接使用黄金ETF价格，显示为人民币/克
 */
export async function fetchGoldData(): Promise<GoldData | null> {
  const now = Date.now();

  // 检查缓存
  if (cachedData && (now - lastFetch) < CACHE_DURATION) {
    console.log('[Gold API] Using cached data');
    return cachedData;
  }

  try {
    console.log('[Gold API] Fetching:', GOLD_ETF_URL);
    const etfResponse = await fetch(GOLD_ETF_URL, {
      headers: { 'Accept': '*/*' }
    });

    console.log('[Gold API] Response status:', etfResponse.status);
    if (!etfResponse.ok) {
      throw new Error(`HTTP ${etfResponse.status}`);
    }

    // 解码GBK响应
    const buffer = await etfResponse.arrayBuffer();
    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(buffer);

    // 解析ETF数据
    const etfData = parseGoldETFData(text);
    if (!etfData) {
      throw new Error('Failed to parse gold ETF data');
    }

    // 转换为人民币/克
    const pricePerGramCNY = convertToCNYPerGram(etfData.price);
    const changePerGramCNY = convertToCNYPerGram(etfData.change);

    const result: GoldData = {
      symbol: 'SH518880',
      name: '黄金现价',
      price: pricePerGramCNY,
      change: changePerGramCNY,
      changePercent: etfData.changePercent,
      updateTime: now
    };

    // 更新缓存
    cachedData = result;
    lastFetch = now;

    console.log('[Gold API] Fetch success:', result);
    return result;
  } catch (error) {
    console.error('[Gold API] Fetch failed:', error);
    return cachedData; // 返回过期缓存而不是null
  }
}
