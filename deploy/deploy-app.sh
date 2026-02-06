#!/bin/bash
set -e

# ===========================================
# 配置变量（可修改）
# ===========================================
DOCKER_IMAGE="xzjohn/zkanban:latest"
CONTAINER_NAME="zkanban"
APP_PORT="3000"
DATA_DIR="/opt/zkanban"

# ===========================================
# 颜色输出
# ===========================================
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  zkanban VPS 部署脚本 - 应用部署"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用 root 用户执行此脚本${NC}"
    echo "   使用: sudo bash deploy-app.sh"
    exit 1
fi

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装，请先运行 install-docker.sh${NC}"
    exit 1
fi

echo -e "${YELLOW}⚙️  部署配置：${NC}"
echo "  镜像:        $DOCKER_IMAGE"
echo "  容器名称:    $CONTAINER_NAME"
echo "  端口映射:    $APP_PORT:$APP_PORT"
echo "  数据目录:    $DATA_DIR"
echo ""

# 创建数据目录
echo "📁 创建数据目录..."
mkdir -p "$DATA_DIR"

# 拉取最新镜像
echo "📥 拉取 Docker 镜像..."
docker pull "$DOCKER_IMAGE"

# 停止并删除旧容器（如果存在）
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "🛑 停止旧容器..."
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
fi

# 运行新容器
echo "🚀 启动新容器..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "$APP_PORT:$APP_PORT" \
  "$DOCKER_IMAGE"

# 等待容器启动
echo "⏳ 等待容器启动..."
sleep 3

# 验证容器状态
echo ""
echo "📊 容器状态："
docker ps -f "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 检查容器日志
echo ""
echo "📋 容器日志（最近 20 行）："
docker logs "$CONTAINER_NAME" --tail 20

# 获取 VPS IP
VPS_IP=$(curl -s4 ifconfig.me 2>/dev/null || curl -s4 ip.sb 2>/dev/null || echo "<您的VPS公网IP>")

echo ""
echo "=========================================="
echo -e "${GREEN}  ✅ 部署完成！${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}🌐 访问地址：${NC}"
echo "  http://$VPS_IP:$APP_PORT"
echo ""
echo -e "${YELLOW}📋 管理命令：${NC}"
echo "  查看日志:   docker logs -f $CONTAINER_NAME"
echo "  重启容器:   docker restart $CONTAINER_NAME"
echo "  停止容器:   docker stop $CONTAINER_NAME"
echo "  查看状态:   docker ps -a | grep $CONTAINER_NAME"
echo ""
echo -e "${YELLOW}🔍 健康检查：${NC}"
echo "  curl http://localhost:$APP_PORT/health"
echo ""
