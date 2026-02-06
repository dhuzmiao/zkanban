/**
 * 金投网 API 服务
 * 用于获取现货黄金(XAU)和现货白银(XAG)实时价格
 *
 * API 端点: https://api.jijinhao.com/sQuoteCenter/realTime.htm?code=JO_92233&isCalc=true
 *
 * 注意：API 返回的价格单位已经是 人民币/克，无需额外转换
 */

// 品种代码
const JIJIHAO_CODES = {
  GOLD_XAU: 'JO_92233',   // 现货黄金
  SILVER_XAG: 'JO_92232'  // 现货白银
} as const;

/**
 * API 响应数据结构
 * 响应格式: var hq_str = "现货黄金,0,昨收,当前价,最高,最低,...,日期,时间,...,涨跌额,涨跌幅,...";
 * 价格单位: 人民币/克
 */
interface JijinhaoRawData {
  name: string;           // 品种名称 (索引0)
  prevClose: number;      // 昨收 (索引2)
  price: number;          // 当前价 (索引3) - 人民币/克
  high: number;           // 最高 (索引4) - 人民币/克
  low: number;            // 最低 (索引5) - 人民币/克
  date: string;           // 日期 (索引30)
  time: string;           // 时间 (索引31)
  change: number;         // 涨跌额 (索引34) - 人民币/克
  changePercent: number;  // 涨跌幅% (索引35)
}

/**
 * 解析后的响应数据
 * 价格单位: 人民币/克
 */
export interface JijinhaoResponse {
  code: string;           // 品种代码
  name: string;           // 品种名称
  price: number;          // 当前价 (人民币/克)
  change: number;         // 涨跌额 (人民币/克)
  changePercent: number;  // 涨跌幅 (%)
  open: number;           // 今开 (人民币/克)
  close: number;          // 昨收 (人民币/克)
  high: number;           // 最高 (人民币/克)
  low: number;            // 最低 (人民币/克)
  time: number;           // 时间戳
}

/**
 * 解析金投网 API 响应
 * 格式: var hq_str = "现货黄金,0,昨收,当前价,最高,最低,...,日期,时间,...,涨跌额,涨跌幅,...";
 *
 * 关键字段索引:
 * - 0: 品种名称
 * - 2: 昨收
 * - 3: 当前价
 * - 4: 最高
 * - 5: 最低
 * - 30: 日期
 * - 31: 时间
 * - 34: 涨跌额
 * - 35: 涨跌幅%
 */
function parseJijinhaoResponse(text: string, code: string): JijinhaoResponse | null {
  try {
    // 提取 hq_str 变量内容
    const regex = /var hq_str\s*=\s*"([^"]*)"/;
    const match = text.match(regex);
    if (!match) {
      console.error('[Jijinhao] Failed to extract hq_str');
      return null;
    }

    const parts = match[1].split(',');
    if (parts.length < 36) {
      console.error('[Jijinhao] Insufficient data fields:', parts.length);
      return null;
    }

    const raw: JijinhaoRawData = {
      name: parts[0] || '',
      prevClose: parseFloat(parts[2]) || 0,
      price: parseFloat(parts[3]) || 0,
      high: parseFloat(parts[4]) || 0,
      low: parseFloat(parts[5]) || 0,
      date: parts[30] || '',
      time: parts[31] || '',
      change: parseFloat(parts[34]) || 0,
      changePercent: parseFloat(parts[35]) || 0
    };

    // 验证数据
    if (raw.price === 0 || isNaN(raw.price)) {
      console.error('[Jijinhao] Invalid price:', raw.price);
      return null;
    }

    // 构建时间戳
    const dateTimeStr = `${raw.date} ${raw.time}`;
    const timestamp = new Date(dateTimeStr).getTime();

    const result: JijinhaoResponse = {
      code,
      name: raw.name,
      price: raw.price,
      change: raw.change,
      changePercent: raw.changePercent,
      open: raw.prevClose + raw.change,  // 今开 = 昨收 + 涨跌额
      close: raw.prevClose,
      high: raw.high,
      low: raw.low,
      time: timestamp || Date.now()
    };

    console.log(`[Jijinhao] Parsed ${code}:`, result);
    return result;
  } catch (error) {
    console.error('[Jijinhao] Parse error:', error);
    return null;
  }
}

/**
 * 获取单个品种实时数据
 */
export async function fetchJijinhaoData(code: string): Promise<JijinhaoResponse | null> {
  try {
    const url = `/api/jijinhao/sQuoteCenter/realTime.htm?code=${code}&isCalc=true&_=${Date.now()}`;
    console.log(`[Jijinhao] Fetching ${code}:`, url);

    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    // console.log('[Jijinhao] Raw response:', text.substring(0, 200));

    return parseJijinhaoResponse(text, code);
  } catch (error) {
    console.error(`[Jijinhao] Fetch ${code} failed:`, error);
    return null;
  }
}

/**
 * 获取现货黄金 XAU 数据
 * 返回价格单位: 人民币/克
 */
export async function fetchGoldXAU(): Promise<JijinhaoResponse | null> {
  return fetchJijinhaoData(JIJIHAO_CODES.GOLD_XAU);
}

/**
 * 获取现货白银 XAG 数据
 * 返回价格单位: 人民币/克
 */
export async function fetchSilverXAG(): Promise<JijinhaoResponse | null> {
  return fetchJijinhaoData(JIJIHAO_CODES.SILVER_XAG);
}
