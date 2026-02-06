#!/bin/bash
set -e

# ===========================================
# 颜色输出
# ===========================================
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ===========================================
# 获取脚本目录
# ===========================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "=========================================="
echo -e "${BLUE}  zkanban 一键部署脚本${NC}"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31m❌ 请使用 root 用户执行此脚本\033[0m"
    echo "   使用: sudo bash deploy-all.sh"
    exit 1
fi

# 显示部署信息
echo -e "${YELLOW}📋 部署信息：${NC}"
echo "  镜像:        xzjohn/zkanban:latest"
echo "  容器名称:    zkanban"
echo "  端口映射:    3000:3000"
echo ""

# 确认开始部署
read -p "是否开始部署？(y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 部署已取消"
    exit 0
fi

echo ""
echo "=========================================="
echo "  开始部署..."
echo "=========================================="
echo ""

# 步骤 1: 安装 Docker
echo -e "${BLUE}[1/3] 安装 Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker 已安装${NC}"
else
    bash "$SCRIPT_DIR/install-docker.sh"
fi

echo ""
echo "=========================================="
echo ""

# 步骤 2: 配置防火墙
echo -e "${BLUE}[2/3] 配置防火墙...${NC}"
read -p "是否配置防火墙？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    bash "$SCRIPT_DIR/configure-firewall.sh"
else
    echo -e "${YELLOW}⚠️  跳过防火墙配置${NC}"
fi

echo ""
echo "=========================================="
echo ""

# 步骤 3: 部署应用
echo -e "${BLUE}[3/3] 部署应用...${NC}"
bash "$SCRIPT_DIR/deploy-app.sh"

echo ""
echo "=========================================="
echo -e "${GREEN}  🎉 部署完成！${NC}"
echo "=========================================="
echo ""
