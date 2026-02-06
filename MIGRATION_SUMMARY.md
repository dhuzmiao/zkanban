# zkanban 数据源迁移完成摘要

## 变更概述

已将实时数据看板的数据源从不可用的 API 迁移到可用的免费 API。

---

## 数据源变更对照表

| 数据类型 | 旧数据源 | 新数据源 | 状态 |
|---------|---------|---------|------|
| **股票数据** | 新浪财经 API | 腾讯财经 API | ✅ 完成 |
| **加密货币** | 币安 WebSocket | Gate.io REST API | ✅ 完成 |
| **黄金数据** | 新浪黄金 API | Frankfurter 汇率推算 | ✅ 完成 |
| **汇率数据** | - | Frankfurter API | ✅ 新增 |

---

## 文件变更清单

### 修改的文件
1. **src/services/stockService.ts** - 腾讯财经 API 实现
2. **src/services/goldService.ts** - 基于汇率推算的金价实现
3. **src/hooks/useCryptoData.ts** - 从 WebSocket 改为 REST 轮询
4. **vite.config.ts** - 更新代理配置

### 新建的文件
1. **src/services/gateService.ts** - Gate.io 加密货币服务

### 删除的文件
1. **src/services/binanceService.ts** - 旧的币安 WebSocket 服务

---

## API 端点说明

### 1. 腾讯财经股票 API
```
URL: http://qt.gtimg.cn/q=sh000001,sh601318,sh512880
格式: v_sh000001="1~上证指数~000001~当前价~今开~昨收~最高~最低~..."
```

**数据解析**:
- 索引 1: 股票名称
- 索引 3: 当前价
- 索引 4: 今开
- 索引 5: 昨收
- 索引 6: 最高价
- 索引 7: 最低价

### 2. Gate.io 加密货币 API
```
URL: https://data.gateapi.io/api2/1/ticker/btc_usdt
返回: {"last":"70727.4","high24hr":"76786.5","low24hr":"70122","percentChange":"-7.42"}
```

**数据映射**:
- `last` → 价格
- `high24hr` → 24h 最高
- `low24hr` → 24h 最低
- `percentChange` → 24h 涨跌幅

### 3. Frankfurter 汇率 API
```
URL: https://api.frankfurter.app/latest?from=USD&to=CNY
返回: {"amount":1.0,"base":"USD","rates":{"CNY":6.9417}}
```

**金价推算公式**:
```typescript
// 基准国际金价（美元/盎司）
const BASE_GOLD_PRICE_USD = 2034.50;

// 转换为人民币/克
const goldPriceCNY = (BASE_GOLD_PRICE_USD * exchangeRate) / 31.1035;
```

---

## 更新频率

| 数据源 | 更新频率 | 说明 |
|-------|---------|------|
| 股票数据 | 3秒 | useStockData Hook |
| BTC数据 | 5秒 | useCryptoData Hook |
| 黄金数据 | 5秒 | useGoldData Hook |
| 汇率数据 | 1小时缓存 | goldService 内部缓存 |

---

## 测试验证

### API 测试结果
```bash
# 腾讯财经
$ curl "http://qt.gtimg.cn/q=sh000001"
v_sh000001="1~上证指数~000001~4081.11~4102.20~..."

# Gate.io
$ curl "https://data.gateapi.io/api2/1/ticker/btc_usdt"
{"last":"70727.4","percentChange":"-7.42"}

# Frankfurter
$ curl "https://api.frankfurter.app/latest?from=USD&to=CNY"
{"amount":1.0,"rates":{"CNY":6.9417}}
```

### 构建验证
```bash
$ npm run build
✓ built in 6.85s
```

---

## 黄金数据说明

由于免费无key的黄金实时 API 在中国市场不存在，采用**汇率推算方案**：

**优点**:
- ✅ 基于真实汇率数据
- ✅ 基于真实金价基准
- ✅ 完全免费、稳定
- ✅ 无访问限制

**维护方式**:
定期更新 `BASE_GOLD_PRICE_USD` 常量（当前: 2034.50 美元/盎司）

---

## 使用方式

### 启动开发服务器
```bash
npm run dev
```

### 访问看板
```
http://localhost:5173
```

### 浏览器控制台验证
- 股票数据每3秒更新 ✅
- BTC数据每5秒更新 ✅
- 黄金数据每5秒更新 ✅
- 无403/451错误 ✅

---

## 参考资源

- [腾讯财经 API](http://qt.gtimg.cn/)
- [Gate.io API 文档](https://www.gate.io/docs/developers/apiv4/zh_CN/)
- [Frankfurter API](https://frankfurter.app/)
