import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 腾讯财经API可能需要代理
      '/api/qt': {
        target: 'http://qt.gtimg.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/qt/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
          })
        }
      },
      // Gate.io API 代理
      '/api/gate': {
        target: 'https://data.gateapi.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gate/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
          })
        }
      },
      // ExchangeRate-API 代理
      '/api/exchangerate': {
        target: 'https://open.er-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exchangerate/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
          })
        }
      }
    }
  }
})
