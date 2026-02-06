#!/bin/bash
set -e

# ===========================================
# 配置变量
# ===========================================
DOCKER_IMAGE="xzjohn/zkanban:latest"
CONTAINER_NAME="zkanban"
APP_PORT="3000"

# ===========================================
# 颜色输出
# ===========================================
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "  zkanban 更新脚本"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户执行此脚本"
    echo "   使用: sudo bash update.sh"
    exit 1
fi

echo -e "${YELLOW}📥 拉取最新镜像...${NC}"
docker pull "$DOCKER_IMAGE"

echo -e "${YELLOW}🔄 重建容器...${NC}"
docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "$APP_PORT:$APP_PORT" \
  "$DOCKER_IMAGE"

echo -e "${YELLOW}🧹 清理旧镜像...${NC}"
docker image prune -f

echo ""
echo "=========================================="
echo -e "${GREEN}  ✅ 更新完成！${NC}"
echo "=========================================="
echo ""

# 显示容器状态
docker ps -f "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
