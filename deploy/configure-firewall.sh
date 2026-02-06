#!/bin/bash
set -e

echo "=========================================="
echo "  zkanban VPS 部署脚本 - 防火墙配置"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户执行此脚本"
    echo "   使用: sudo bash configure-firewall.sh"
    exit 1
fi

echo "⚙️  配置防火墙规则..."
echo ""

# 允许 SSH
echo "✅ 允许 SSH (端口 22)"
ufw allow 22/tcp

# 允许应用端口
echo "✅ 允许 zkanban 应用 (端口 3000)"
ufw allow 3000/tcp

# 显示当前规则
echo ""
echo "📋 当前防火墙规则："
ufw status numbered

# 启用防火墙（如果未启用）
echo ""
read -p "是否启用防火墙？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ufw --force enable
    echo "✅ 防火墙已启用"
else
    echo "⚠️  防火墙未启用"
fi

echo ""
echo "=========================================="
echo "  ✅ 防火墙配置完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "  部署应用: bash deploy-app.sh"
echo ""
