import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchExchangeRateData } from '@/services/exchangeRateService';

const EXCHANGE_RATE_POLL_INTERVAL = 3600000; // 1小时轮询（汇率变化较慢）

/**
 * 汇率数据轮询 Hook
 */
export function useExchangeRateData() {
  const updateExchangeRate = useDashboardStore((state) => state.updateExchangeRate);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 立即获取一次数据
    const fetchData = async () => {
      const exchangeRate = await fetchExchangeRateData();
      if (exchangeRate) {
        updateExchangeRate(exchangeRate);
      }
    };

    fetchData();

    // 设置定时轮询
    intervalRef.current = setInterval(fetchData, EXCHANGE_RATE_POLL_INTERVAL);

    // 清理
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateExchangeRate]);
}
