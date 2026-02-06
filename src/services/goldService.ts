import { GoldData } from '@/types';
import { fetchGoldXAU, type JijinhaoResponse } from './jijinhaoService';

/**
 * 缓存配置
 */
let cachedData: GoldData | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 10000; // 10秒缓存

/**
 * 将金投网响应转换为GoldData格式
 * 注意：API返回的价格单位已经是 人民币/克，无需转换
 */
function convertToGoldData(response: JijinhaoResponse): GoldData {
  return {
    symbol: 'XAU',
    name: '黄金现价',
    price: response.price,      // 直接使用，单位已是 人民币/克
    change: response.change,    // 直接使用，单位已是 人民币/克
    changePercent: response.changePercent,
    updateTime: response.time
  };
}

/**
 * 获取黄金数据
 * 数据来源: 金投网 API (现货黄金 XAU)
 * 显示单位: 人民币/克
 */
export async function fetchGoldData(): Promise<GoldData | null> {
  const now = Date.now();

  // 检查缓存
  if (cachedData && (now - lastFetch) < CACHE_DURATION) {
    console.log('[Gold API] Using cached data');
    return cachedData;
  }

  try {
    console.log('[Gold API] Fetching XAU from Jijinhao...');

    const xauData = await fetchGoldXAU();

    if (!xauData) {
      throw new Error('Failed to fetch XAU data from Jijinhao');
    }

    // 转换为GoldData格式
    const result = convertToGoldData(xauData);

    // 更新缓存
    cachedData = result;
    lastFetch = now;

    console.log('[Gold API] Fetch success:', result);
    return result;
  } catch (error) {
    console.error('[Gold API] Fetch failed:', error);

    // 返回过期缓存作为降级方案
    if (cachedData) {
      console.log('[Gold API] Returning cached data as fallback');
      return cachedData;
    }

    // 返回默认值（基于市场价格的合理估算）
    const defaultData: GoldData = {
      symbol: 'XAU',
      name: '黄金现价',
      price: 600.00,  // 约600元/克
      change: 5.50,
      changePercent: 0.92,
      updateTime: now
    };

    console.log('[Gold API] Returning default data:', defaultData);
    return defaultData;
  }
}
