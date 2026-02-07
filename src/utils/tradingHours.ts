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
