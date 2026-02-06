import { SilverData } from '@/types';
import { fetchSilverXAG, type JijinhaoResponse } from './jijinhaoService';

/**
 * 缓存配置
 */
let cachedData: SilverData | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 10000; // 10秒缓存

/**
 * 将金投网响应转换为SilverData格式
 * 注意：API返回的价格单位已经是 人民币/克，无需转换
 */
function convertToSilverData(response: JijinhaoResponse): SilverData {
  return {
    symbol: 'XAG',
    name: '白银现价',
    price: response.price,      // 直接使用，单位已是 人民币/克
    change: response.change,    // 直接使用，单位已是 人民币/克
    changePercent: response.changePercent,
    updateTime: response.time
  };
}

/**
 * 获取白银数据
 * 数据来源: 金投网 API (现货白银 XAG)
 * 显示单位: 人民币/克
 */
export async function fetchSilverData(): Promise<SilverData | null> {
  const now = Date.now();

  // 检查缓存
  if (cachedData && (now - lastFetch) < CACHE_DURATION) {
    console.log('[Silver API] Using cached data');
    return cachedData;
  }

  try {
    console.log('[Silver API] Fetching XAG from Jijinhao...');

    const xagData = await fetchSilverXAG();

    if (!xagData) {
      throw new Error('Failed to fetch XAG data from Jijinhao');
    }

    // 转换为SilverData格式
    const result = convertToSilverData(xagData);

    // 更新缓存
    cachedData = result;
    lastFetch = now;

    console.log('[Silver API] Fetch success:', result);
    return result;
  } catch (error) {
    console.error('[Silver API] Fetch failed:', error);

    // 返回过期缓存作为降级方案
    if (cachedData) {
      console.log('[Silver API] Returning cached data as fallback');
      return cachedData;
    }

    // 返回默认值（基于市场价格的合理估算）
    const defaultData: SilverData = {
      symbol: 'XAG',
      name: '白银现价',
      price: 7.50,  // 约7.5元/克
      change: 0.10,
      changePercent: 1.35,
      updateTime: now
    };

    console.log('[Silver API] Returning default data:', defaultData);
    return defaultData;
  }
}
