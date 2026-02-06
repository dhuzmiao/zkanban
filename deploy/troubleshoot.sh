#!/bin/bash
set -e

# ===========================================
# 配置变量
# ===========================================
CONTAINER_NAME="zkanban"
APP_PORT="3000"

# ===========================================
# 颜色输出
# ===========================================
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "=========================================="
echo "  zkanban 故障排查脚本"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用 root 用户执行此脚本${NC}"
    echo "   使用: sudo bash troubleshoot.sh"
    exit 1
fi

# 1. 检查 Docker 服务
echo -e "${YELLOW}📋 1. Docker 服务状态：${NC}"
systemctl status docker --no-pager -l | head -n 10
echo ""

# 2. 检查容器状态
echo -e "${YELLOW}📋 2. 容器状态：${NC}"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker ps -a -f "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.State}}"
else
    echo -e "${RED}❌ 容器不存在${NC}"
fi
echo ""

# 3. 检查容器日志
echo -e "${YELLOW}📋 3. 容器日志（最近 30 行）：${NC}"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker logs "$CONTAINER_NAME" --tail 30
else
    echo -e "${RED}容器不存在，无法查看日志${NC}"
fi
echo ""

# 4. 检查端口占用
echo -e "${YELLOW}📋 4. 端口占用检查：${NC}"
if command -v netstat &> /dev/null; then
    netstat -tlnp | grep ":$APP_PORT" || echo "端口 $APP_PORT 未被占用"
else
    ss -tlnp | grep ":$APP_PORT" || echo "端口 $APP_PORT 未被占用"
fi
echo ""

# 5. 检查防火墙状态
echo -e "${YELLOW}📋 5. 防火墙状态：${NC}"
if command -v ufw &> /dev/null; then
    ufw status
else
    echo "ufw 未安装"
fi
echo ""

# 6. 检查本地连接
echo -e "${YELLOW}📋 6. 本地连接测试：${NC}"
if command -v curl &> /dev/null; then
    curl -s -o /dev/null -w "HTTP 状态码: %{http_code}\n" "http://localhost:$APP_PORT/health" || echo "连接失败"
else
    echo "curl 未安装，无法测试连接"
fi
echo ""

# 7. 资源使用情况
echo -e "${YELLOW}📋 7. 容器资源使用：${NC}"
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker stats "$CONTAINER_NAME" --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
else
    echo "容器未运行"
fi
echo ""

echo "=========================================="
echo "  故障排查完成"
echo "=========================================="
