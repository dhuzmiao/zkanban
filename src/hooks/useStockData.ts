import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchStockData, fetchUSIndicesData } from '@/services/stockService';

const STOCK_POLL_INTERVAL = 3000; // 3秒轮询

/**
 * 股票数据轮询 Hook
 */
export function useStockData() {
  const updateStock = useDashboardStore((state) => state.updateStock);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 立即获取一次数据
    const fetchData = async () => {
      // 获取中国股票数据
      const stocks = await fetchStockData();
      Object.entries(stocks).forEach(([symbol, data]) => {
        updateStock(symbol, data);
      });

      // 获取美股指数数据
      const usIndicesData = await fetchUSIndicesData();
      Object.entries(usIndicesData).forEach(([symbol, data]) => {
        updateStock(symbol, data);
      });
    };

    fetchData();

    // 设置定时轮询
    intervalRef.current = setInterval(fetchData, STOCK_POLL_INTERVAL);

    // 清理
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateStock]);
}
