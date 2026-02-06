#!/bin/bash
set -e

echo "=========================================="
echo "  zkanban VPS 部署脚本 - Docker 安装"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户执行此脚本"
    echo "   使用: sudo bash install-docker.sh"
    exit 1
fi

# 更新包索引
echo "📦 更新包索引..."
apt-get update -y

# 安装必要的依赖
echo "📦 安装依赖包..."
apt-get install -y ca-certificates curl gnupg

# 添加 Docker 官方 GPG 密钥
echo "🔑 添加 Docker GPG 密钥..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# 设置 Docker 仓库
echo "📝 设置 Docker 仓库..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
echo "📦 安装 Docker Engine..."
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动 Docker 服务
echo "🚀 启动 Docker 服务..."
systemctl start docker
systemctl enable docker

# 验证安装
echo "✅ 验证 Docker 安装..."
docker run --rm hello-world

echo ""
echo "=========================================="
echo "  ✅ Docker 安装完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "  1. 配置防火墙: bash configure-firewall.sh"
echo "  2. 部署应用:   bash deploy-app.sh"
echo ""
