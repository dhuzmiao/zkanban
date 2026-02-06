import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchGateCryptoData } from '@/services/gateService';

/**
 * 加密货币数据轮询 Hook
 * 使用 Gate.io REST API 替代 WebSocket
 */
export function useCryptoData() {
  const updateCrypto = useDashboardStore((state) => state.updateCrypto);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 立即获取一次数据
    const fetchData = async () => {
      const data = await fetchGateCryptoData('btc_usdt');
      if (data) {
        updateCrypto(data);
      }
    };

    fetchData();

    // 设置轮询（5秒间隔）
    intervalRef.current = setInterval(() => {
      fetchData();
    }, 5000);

    // 清理
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateCrypto]);
}
