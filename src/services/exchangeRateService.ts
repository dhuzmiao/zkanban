import { ExchangeRateData } from '@/types';

/**
 * ExchangeRate-API 配置
 * API: https://open.er-api.com/v6/latest/USD
 * 免费无需注册，每小时更新，同时支持CNY和CNH
 */
const EXCHANGE_RATE_URL = '/api/exchangerate/v6/latest/USD';

/**
 * 缓存配置
 */
let cachedData: ExchangeRateData | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 500; // 0.5秒缓存（高频更新）

/**
 * ExchangeRate-API 响应接口
 */
interface ExchangeRateAPIResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_codes: string[];
  rates: {
    [key: string]: number;
  };
}

/**
 * 解析 ExchangeRate-API 响应
 */
function parseExchangeRateResponse(response: ExchangeRateAPIResponse): ExchangeRateData | null {
  try {
    // 获取离岸人民币汇率
    const cnhRate = response.rates.CNH;
    if (!cnhRate) {
      console.error('[ExchangeRate] CNH rate not found in response');
      return null;
    }

    // 计算涨跌（与缓存数据对比）
    let change = 0;
    let changePercent = 0;
    if (cachedData) {
      change = cnhRate - cachedData.rate;
      changePercent = cachedData.rate > 0 ? (change / cachedData.rate) * 100 : 0;
    }

    return {
      symbol: 'USD/CNH',
      name: '美元/离岸人民币',
      price: cnhRate,
      change,
      changePercent,
      updateTime: Date.now(),
      baseCurrency: 'USD',
      quoteCurrency: 'CNH',
      rate: cnhRate,
      lastUpdate: response.time_last_update_utc
    };
  } catch (error) {
    console.error('[ExchangeRate] Failed to parse response:', error);
    return null;
  }
}

/**
 * 获取汇率数据
 */
export async function fetchExchangeRateData(): Promise<ExchangeRateData | null> {
  const now = Date.now();

  // 检查缓存
  if (cachedData && (now - lastFetch) < CACHE_DURATION) {
    console.log('[ExchangeRate API] Using cached data');
    return cachedData;
  }

  try {
    console.log('[ExchangeRate API] Fetching:', EXCHANGE_RATE_URL);
    const response = await fetch(EXCHANGE_RATE_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('[ExchangeRate API] Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: ExchangeRateAPIResponse = await response.json();
    console.log('[ExchangeRate API] Response data:', data);

    if (data.result !== 'success') {
      throw new Error('API returned unsuccessful result');
    }

    // 解析响应
    const result = parseExchangeRateResponse(data);
    if (!result) {
      throw new Error('Failed to parse exchange rate data');
    }

    // 更新缓存
    cachedData = result;
    lastFetch = now;

    console.log('[ExchangeRate API] Fetch success:', result);
    return result;
  } catch (error) {
    console.error('[ExchangeRate API] Fetch failed:', error);
    return cachedData; // 返回过期缓存而不是null
  }
}
