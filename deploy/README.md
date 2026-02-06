# zkanban VPS 部署指南

完整的 zkanban 应用 VPS 部署脚本和文档。

## 📋 目录

- [快速开始](#快速开始)
- [部署步骤](#部署步骤)
- [管理命令](#管理命令)
- [故障排查](#故障排查)
- [定时自动更新](#定时自动更新)

---

## 🚀 快速开始

### 前置要求

- **操作系统**: Ubuntu 20.04+ / Debian 11+
- **权限**: root 或 sudo 权限
- **网络**: 开放端口 3000

### 一键部署（推荐）

```bash
# 1. 上传脚本到 VPS
scp -r deploy/ root@<您的VPS_IP>:/opt/

# 2. SSH 登录 VPS
ssh root@<您的VPS_IP>

# 3. 进入部署目录
cd /opt/deploy

# 4. 赋予执行权限
chmod +x *.sh

# 5. 依次执行
sudo bash install-docker.sh      # 安装 Docker
sudo bash configure-firewall.sh  # 配置防火墙
sudo bash deploy-app.sh          # 部署应用
```

---

## 📦 部署步骤

### 步骤 1：安装 Docker

```bash
sudo bash install-docker.sh
```

**执行内容**：
- 更新包索引
- 安装 Docker Engine
- 启动 Docker 服务
- 验证安装

### 步骤 2：配置防火墙

```bash
sudo bash configure-firewall.sh
```

**执行内容**：
- 允许 SSH (端口 22)
- 允许应用端口 (3000)
- 启用 UFW 防火墙

### 步骤 3：部署应用

```bash
sudo bash deploy-app.sh
```

**执行内容**：
- 拉取 Docker 镜像 (`xzjohn/zkanban:latest`)
- 创建并启动容器
- 端口映射 `3000:3000`
- 设置重启策略 `unless-stopped`

---

## 🛠️ 管理命令

### 查看容器状态

```bash
docker ps -a | grep zkanban
```

### 查看实时日志

```bash
docker logs -f zkanban
```

### 查看最近日志

```bash
docker logs zkanban --tail 50
```

### 重启容器

```bash
docker restart zkanban
```

### 停止容器

```bash
docker stop zkanban
```

### 启动已停止的容器

```bash
docker start zkanban
```

### 查看资源使用

```bash
docker stats zkanban
```

---

## 🔄 更新应用

### 手动更新

```bash
sudo bash update.sh
```

**执行流程**：
1. 拉取最新镜像
2. 停止并删除旧容器
3. 启动新容器
4. 清理旧镜像

---

## 🔍 故障排查

### 自动诊断

```bash
sudo bash troubleshoot.sh
```

**检查项目**：
- Docker 服务状态
- 容器运行状态
- 容器日志
- 端口占用情况
- 防火墙配置
- 本地连接测试
- 资源使用情况

### 常见问题

#### 容器无法启动

```bash
# 查看详细错误日志
docker logs zkanban

# 检查镜像是否存在
docker images | grep zkanban
```

#### 网络无法访问

```bash
# 检查防火墙状态
sudo ufw status

# 检查端口映射
docker port zkanban

# 测试本地访问
curl http://localhost:3000/health
```

#### 镜像拉取失败

```bash
# 检查 Docker 连接
docker info

# 检查磁盘空间
df -h

# 手动重新拉取
docker pull xzjohn/zkanban:latest
```

---

## ⏰ 定时自动更新

### 配置 Crontab

```bash
# 编辑 crontab
sudo crontab -e

# 添加以下行（每天凌晨 3 点自动更新）
0 3 * * * /opt/deploy/update.sh >> /var/log/zkanban-update.log 2>&1
```

### 查看更新日志

```bash
tail -f /var/log/zkanban-update.log
```

---

## 🔐 安全建议

1. **使用非 root 用户运行容器**
   ```bash
   docker run -d \
     --name zkanban \
     --restart unless-stopped \
     -p 3000:3000 \
     -u 1000:1000 \
     xzjohn/zkanban:latest
   ```

2. **配置防火墙白名单**（仅允许特定 IP）
   ```bash
   sudo ufw allow from <您的IP> to any port 3000
   ```

3. **启用 HTTPS**（使用 Nginx 反向代理 + Let's Encrypt）
   - 参考下方"可选增强"章节

---

## 🌐 可选增强

### 配置域名和 HTTPS

如有域名，可使用 Nginx 反向代理 + Let's Encrypt：

```bash
# 安装 Nginx 和 Certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 配置 Nginx 反向代理
sudo nano /etc/nginx/sites-available/zkanban
```

Nginx 配置文件：

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置并获取 SSL 证书：

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/zkanban /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com
```

---

## 📞 支持

如有问题，请：
1. 运行故障排查脚本: `sudo bash troubleshoot.sh`
2. 查看容器日志: `docker logs zkanban`
3. 检查系统日志: `journalctl -u docker -n 50`

---

## 📄 许可证

MIT License
