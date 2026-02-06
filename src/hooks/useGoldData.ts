import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchGoldData } from '@/services/goldService';

const GOLD_POLL_INTERVAL = 5000; // 5秒轮询

/**
 * 黄金数据轮询 Hook
 */
export function useGoldData() {
  const updateGold = useDashboardStore((state) => state.updateGold);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 立即获取一次数据
    const fetchData = async () => {
      const gold = await fetchGoldData();
      if (gold) {
        updateGold(gold);
      }
    };

    fetchData();

    // 设置定时轮询
    intervalRef.current = setInterval(fetchData, GOLD_POLL_INTERVAL);

    // 清理
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateGold]);
}
