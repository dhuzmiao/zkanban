import { useEffect, useRef, useState } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchExchangeRateData } from '@/services/exchangeRateService';
import { useFinnhubWebSocket } from '@/hooks/useFinnhubWebSocket';
import type { DataSource } from '@/types';

const EXCHANGE_RATE_POLL_INTERVAL = 60000; // 降级时使用 60 秒轮询（减少API调用）

/**
 * 汇率数据 Hook（增强版 - 支持 WebSocket）
 *
 * 实现策略（依赖倒置原则）：
 * 1. 优先使用 WebSocket 实时数据
 * 2. WebSocket 不可用时降级到 REST API
 * 3. 自动切换数据源
 *
 * 遵循 SOLID 原则：
 * - S: 单一职责 - 仅负责数据源选择和更新
 * - O: 开闭原则 - 可以扩展新的数据源
 * - D: 依赖倒置 - 依赖于抽象的数据获取接口
 */
export function useExchangeRateData() {
  const updateExchangeRate = useDashboardStore((state) => state.updateExchangeRate);

  // WebSocket 数据
  const { rate: wsRate, status: wsStatus, isConnected: wsConnected } = useFinnhubWebSocket();

  // 使用 ref 保存最新的状态，避免在 setTimeout 闭包中使用旧值
  const wsStatusRef = useRef(wsStatus);
  wsStatusRef.current = wsStatus;

  // 数据源状态
  const [dataSource, setDataSource] = useState<DataSource>('rest-api');
  const [wsAvailable, setWsAvailable] = useState(false);

  // REST API 轮询
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRateRef = useRef<number | null>(null);

  /**
   * REST API 数据获取（降级方案）
   */
  const fetchRestAPIData = async () => {
    const data = await fetchExchangeRateData();
    if (data) {
      // 修复：更新 lastUpdate 为当前时间，而非 API 返回的旧时间
      updateExchangeRate({
        ...data,
        lastUpdate: new Date().toISOString()
      });
      lastRateRef.current = data.rate;
    }
  };

  /**
   * 使用 WebSocket 数据更新
   */
  useEffect(() => {
    // 检查 WebSocket 是否可用
    if (wsStatus === 'connected' && wsRate !== null) {
      console.log('[ExchangeRate] Using WebSocket data:', wsRate);

      // 计算涨跌
      let change = 0;
      let changePercent = 0;
      if (lastRateRef.current !== null) {
        change = wsRate - lastRateRef.current;
        changePercent = lastRateRef.current > 0 ? (change / lastRateRef.current) * 100 : 0;
      }

      // 更新到 store
      updateExchangeRate({
        symbol: 'USD/CNH',
        name: '美元/离岸人民币',
        price: wsRate,
        change,
        changePercent,
        updateTime: Date.now(),
        baseCurrency: 'USD',
        quoteCurrency: 'CNH',
        rate: wsRate,
        lastUpdate: new Date().toISOString()
      });

      lastRateRef.current = wsRate;
      setDataSource('websocket');
      setWsAvailable(true);

      // 停止 REST API 轮询
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [wsRate, wsStatus, updateExchangeRate]);

  /**
   * 监听 WebSocket 连接状态，实现降级策略
   */
  useEffect(() => {
    // WebSocket 连接失败或断开时，启用 REST API
    if (wsStatus === 'error' || wsStatus === 'disconnected') {
      console.log('[ExchangeRate] WebSocket unavailable, falling back to REST API');

      // 延迟启动降级（避免频繁切换）
      const fallbackTimer = setTimeout(() => {
        if (wsStatusRef.current !== 'connected') {
          setDataSource('rest-api');

          // 立即获取一次数据
          fetchRestAPIData();

          // 启动轮询
          if (!intervalRef.current) {
            intervalRef.current = setInterval(fetchRestAPIData, EXCHANGE_RATE_POLL_INTERVAL);
          }
        }
      }, 2000); // 2 秒延迟

      return () => clearTimeout(fallbackTimer);
    }

    // WebSocket 连接成功时，清理 REST API 轮询
    if (wsStatus === 'connected' && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [wsStatus]);

  /**
   * 组件卸载时清理
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  /**
   * 暴露数据源信息（用于调试和 UI 显示）
   */
  return {
    dataSource,
    wsConnected: wsConnected,
    wsAvailable
  };
}

/**
 * 原有的轮询版本（保留用于兼容性）
 * @deprecated 请使用 useExchangeRateData 代替
 */
export function useExchangeRateDataLegacy() {
  const updateExchangeRate = useDashboardStore((state) => state.updateExchangeRate);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const exchangeRate = await fetchExchangeRateData();
      if (exchangeRate) {
        updateExchangeRate(exchangeRate);
      }
    };

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
