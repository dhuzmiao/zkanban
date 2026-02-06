import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchStockData } from '@/services/stockService';

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
      const stocks = await fetchStockData();
      Object.entries(stocks).forEach(([symbol, data]) => {
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
