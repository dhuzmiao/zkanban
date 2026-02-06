import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchGateCryptoData } from '@/services/gateService';

/**
 * 支持的加密货币交易对
 */
const CRYPTO_SYMBOLS = ['btc_usdt', 'eth_usdt', 'sol_usdt'];

/**
 * 加密货币数据轮询 Hook
 * 使用 Gate.io REST API 获取多个币种数据
 */
export function useCryptoData() {
  const updateCrypto = useDashboardStore((state) => state.updateCrypto);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 获取所有币种数据
    const fetchAllData = async () => {
      for (const symbol of CRYPTO_SYMBOLS) {
        const data = await fetchGateCryptoData(symbol);
        if (data) {
          updateCrypto(data.symbol, data);
        }
      }
    };

    // 立即获取一次数据
    fetchAllData();

    // 设置轮询（5秒间隔）
    intervalRef.current = setInterval(() => {
      fetchAllData();
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
