/**
 * 格式化价格显示
 */
export function formatPrice(price: number, decimals: number = 2): string {
  return price.toFixed(decimals);
}

/**
 * 格式化百分比
 */
export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * 格式化时间
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * 判断涨跌颜色类名
 */
export function getColorClass(value: number): string {
  return value >= 0 ? 'text-rise' : 'text-fall';
}

/**
 * 获取背景颜色类名
 */
export function getBgColorClass(value: number): string {
  return value >= 0 ? 'bg-rise' : 'bg-fall';
}
