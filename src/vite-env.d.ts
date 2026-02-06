/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// NodeJS.Timeout 类型定义（用于浏览器环境）
declare global {
  var NodeJS: {
    Timeout: number
  }
}
