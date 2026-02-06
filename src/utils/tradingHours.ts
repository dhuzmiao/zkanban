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
 * 检查黄金/白银是否在交易时间
 * 现货黄金和现货白银是全球24小时交易的
 *
 * 交易市场：
 * - 纽约商品交易所 (COMEX): 全球最大黄金期货市场
 * - 伦敦金银市场 (LBMA): 现货交易中心
 * - 上海黄金交易所: 国内现货黄金
 * - 东京工业品交易所 (TOCOM): 亚洲主要市场
 *
 * 交易时间：周一至周五，24小时连续交易
 */
export function checkIfGoldTrading(): boolean {
  return true;
}

/**
 * 检查白银是否在交易时间（与黄金相同）
 * 现货白银同样是24小时全球交易
 */
export function checkIfSilverTrading(): boolean {
  return true;
}
