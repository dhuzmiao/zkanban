# 阶段1: 构建 (Node.js 20 Alpine)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# 阶段2: 生产 (Nginx Alpine)
FROM nginx:1.27-alpine AS production
RUN apk add --no-cache curl
RUN addgroup -g 1001 -S app-user && \
    adduser -S -D -H -u 1001 -h /usr/share/nginx/html -s /sbin/nologin -G app-user -g app-user app-user
COPY --from=builder --chown=app-user:app-user /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R app-user:app-user /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /run/nginx.pid && chown app-user:app-user /run/nginx.pid
USER app-user
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
