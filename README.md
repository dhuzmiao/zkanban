# 实时数据看板 (zkanban)

一个纯前端的实时数据监控看板，采用平铺卡片式布局，持续动态更新股票、黄金和比特币价格。

## 技术栈

- **React 19** + **TypeScript** - 核心框架
- **Vite** - 构建工具
- **TailwindCSS** - 响应式样式
- **Zustand** - 轻量级状态管理

## 数据源

| 数据源 | API | 更新方式 | 频率 |
|--------|-----|----------|------|
| 上证指数 | 新浪财经 API | HTTP 轮询 | 3秒 |
| 中国平安 | 新浪财经 API | HTTP 轮询 | 3秒 |
| 券商ETF | 新浪财经 API | HTTP 轮询 | 3秒 |
| 伦敦金 | 新浪财经 API | HTTP 轮询 | 5秒 |
| 比特币 | 币安 WebSocket | WebSocket | 实时 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── components/          # UI组件
│   ├── Dashboard.tsx   # 主看板容器
│   ├── StockCard.tsx   # 股票卡片
│   ├── GoldCard.tsx    # 黄金卡片
│   └── CryptoCard.tsx  # 加密货币卡片
├── services/           # 数据服务层
│   ├── stockService.ts      # 新浪API (JSONP)
│   ├── goldService.ts       # 黄金数据服务
│   └── binanceService.ts    # 币安WebSocket
├── hooks/              # 自定义Hooks
│   ├── useStockData.ts      # 股票数据轮询
│   ├── useGoldData.ts       # 黄金数据轮询
│   └── useCryptoData.ts     # BTC WebSocket
├── store/              # 状态管理
│   └── useDashboardStore.ts # Zustand全局状态
├── types/              # 类型定义
│   └── index.ts
├── utils/              # 工具函数
│   └── formatters.ts
├── App.tsx
└── main.tsx
```

## 功能特性

- ✅ 实时数据更新
- ✅ 响应式设计（支持移动端）
- ✅ 涨跌颜色指示（红涨绿跌）
- ✅ 暗色模式支持
- ✅ WebSocket 自动重连
- ✅ TypeScript 类型安全

## 设计原则

本项目遵循以下软件工程原则：

- **KISS**: 代码简洁直观，避免过度设计
- **DRY**: 复用组件和服务逻辑，消除重复代码
- **SOLID**: 组件单一职责，易于扩展和维护
- **YAGNI**: 仅实现所需功能，避免未来性预留

## 浏览器兼容性

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- 移动端浏览器

## 注意事项

由于使用了新浪财经的 JSONP 接口，请确保：
1. 在 HTTP/HTTPS 环境下运行
2. 浏览器允许跨域请求
3. WebSocket 端口（9443）可访问
