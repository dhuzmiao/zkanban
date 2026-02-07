/**
 * 交易时间判断工具
 */

/**
 * 检查A股是否在交易时间
 */
export function checkIfStockTrading(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const day = now.getDay(); // 0=周日, 6=周六

  // 周末不开盘
  if (day === 0 || day === 6) return false;

  // A股交易时间: 9:30-11:30, 13:00-15:00
  const time = hour * 60 + minute;
  const morning = time >= 9 * 60 + 30 && time < 11 * 60 + 30;
  const afternoon = time >= 13 * 60 && time < 15 * 60;

  return morning || afternoon;
}

/**
 * 判断美国当前是否为夏令时
 * 美国夏令时：3月第二个周日 - 11月第一个周日
 */
function isUSDST(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11

  // 1月、2月肯定是冬令时
  if (month < 2) return false;
  // 12月肯定是冬令时
  if (month > 10) return false;

  // 计算美国夏令时开始日期（3月第二个周日）
  const dstStart = new Date(year, 2, 1); // 3月1日
  const startDayOfWeek = dstStart.getDay(); // 3月1日是星期几
  const daysToAdd = (7 - startDayOfWeek) % 7 + 7; // 到第二个周日需要加的天数
  dstStart.setDate(daysToAdd + 1);
  dstStart.setHours(2, 0, 0, 0); // 夏令时凌晨2点开始

  // 计算美国夏令时结束日期（11月第一个周日）
  const dstEnd = new Date(year, 10, 1); // 11月1日
  const endDayOfWeek = dstEnd.getDay(); // 11月1日是星期几
  const endDaysToAdd = (7 - endDayOfWeek) % 7; // 到第一个周日需要加的天数
  dstEnd.setDate(endDaysToAdd + 1);
  dstEnd.setHours(2, 0, 0, 0); // 夏令时凌晨2点结束

  return date >= dstStart && date < dstEnd;
}

/**
 * 检查美股是否在交易时间
 * 美股常规交易时间：周一至周五 9:30 AM - 4:00 PM ET
 * 北京时间换算：
 * - 夏令时(3月第二个周日-11月第一个周日): 21:30 - 次日04:00
 * - 冬令时(11月第一个周日-3月第二个周日): 22:30 - 次日05:00
 */
export function checkIfUSMarketTrading(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  // 周末不交易（美股周末）
  if (day === 0 || day === 6) return false;

  // 判断是否夏令时
  const isDST = isUSDST(now);

  // 根据夏令时/冬令时确定交易时间（北京时间）
  const marketOpen = isDST ? 21 * 60 + 30 : 22 * 60 + 30;  // 夏:21:30 冬:22:30
  const marketClose = isDST ? 4 * 60 : 5 * 60;               // 夏:04:00 冬:05:00

  // 处理跨日情况
  // 如果当前时间 >= 开盘时间，或者 < 收盘时间（次日），则正在交易
  if (currentTime >= marketOpen || currentTime < marketClose) {
    return true;
  }

  return false;
}

/**
 * 检查加密货币是否在交易时间（24/7交易）
 */
export function checkIfCryptoTrading(): boolean {
  return true;
}

/**
 * 检查黄金是否在交易时间
 * 按照上海黄金交易所交易时间
 * 日盘：周一至周五 9:30-11:30, 13:00-15:00
 * 周末及法定节假日不交易
 */
export function checkIfGoldTrading(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const day = now.getDay(); // 0=周日, 6=周六

  // 周末不开盘
  if (day === 0 || day === 6) return false;

  // 交易时间: 9:30-11:30, 13:00-15:00
  const time = hour * 60 + minute;
  const morning = time >= 9 * 60 + 30 && time < 11 * 60 + 30;
  const afternoon = time >= 13 * 60 && time < 15 * 60;

  return morning || afternoon;
}

/**
 * 检查白银是否在交易时间
 * 按照上海黄金交易所白银交易时间
 * 日盘：周一至周五 9:30-11:30, 13:00-15:00
 * 周末及法定节假日不交易
 */
export function checkIfSilverTrading(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const day = now.getDay(); // 0=周日, 6=周六

  // 周末不开盘
  if (day === 0 || day === 6) return false;

  // 交易时间: 9:30-11:30, 13:00-15:00
  const time = hour * 60 + minute;
  const morning = time >= 9 * 60 + 30 && time < 11 * 60 + 30;
  const afternoon = time >= 13 * 60 && time < 15 * 60;

  return morning || afternoon;
}
