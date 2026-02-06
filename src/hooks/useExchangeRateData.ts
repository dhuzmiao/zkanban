import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchExchangeRateData } from '@/services/exchangeRateService';

const EXCHANGE_RATE_POLL_INTERVAL = 60000; // 60 秒轮询

/**
 * 汇率数据 Hook
 *
 * 遵循 SOLID 原则：
 * - S: 单一职责 - 仅负责汇率数据获取和更新
 * - KISS: 使用简单的 REST API 轮询
 */
export function useExchangeRateData() {
  const updateExchangeRate = useDashboardStore((state) => state.updateExchangeRate);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    const data = await fetchExchangeRateData();
    if (data) {
      updateExchangeRate({
        ...data,
        lastUpdate: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, EXCHANGE_RATE_POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateExchangeRate]);
}
