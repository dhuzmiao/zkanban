import { create } from 'zustand';
import { DashboardState, DashboardActions, StockData, GoldData, SilverData, CryptoData, ExchangeRateData } from '@/types';

type DashboardStore = DashboardState & DashboardActions;

export const useDashboardStore = create<DashboardStore>((set) => ({
  // 初始状态
  stocks: {},
  gold: null,
  silver: null,
  crypto: {},
  exchangeRate: null,
  lastUpdate: 0,

  // Actions
  updateStock: (symbol: string, data: StockData) =>
    set(() => ({
      stocks: { ...useDashboardStore.getState().stocks, [symbol]: data },
      lastUpdate: Date.now()
    })),

  updateGold: (data: GoldData) =>
    set(() => ({
      gold: data,
      lastUpdate: Date.now()
    })),

  updateSilver: (data: SilverData) =>
    set(() => ({
      silver: data,
      lastUpdate: Date.now()
    })),

  updateCrypto: (symbol: string, data: CryptoData) =>
    set(() => ({
      crypto: { ...useDashboardStore.getState().crypto, [symbol]: data },
      lastUpdate: Date.now()
    })),

  updateExchangeRate: (data: ExchangeRateData) =>
    set(() => ({
      exchangeRate: data,
      lastUpdate: Date.now()
    })),

  setLastUpdate: (time: number) =>
    set({ lastUpdate: time })
}));
