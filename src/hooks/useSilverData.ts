import { useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchSilverData } from '@/services/silverService';

/**
 * 白银数据轮询 Hook
 */
export function useSilverData() {
  const updateSilver = useDashboardStore((state) => state.updateSilver);

  useEffect(() => {
    const fetchData = async () => {
      const silverData = await fetchSilverData();
      if (silverData) {
        updateSilver(silverData);
      }
    };

    fetchData();

    // 设置轮询（10秒间隔，与缓存时间一致）
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [updateSilver]);
}
