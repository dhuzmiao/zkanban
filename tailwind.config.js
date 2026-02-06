/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 背景系统
        'deep-space': '#0a0a0f',
        'glass-card': 'rgba(17, 17, 27, 0.8)',
        'glass-section': 'rgba(255, 255, 255, 0.02)',

        // 状态色
        'status-trading': '#00ff88',
        'status-stopped': '#4a5568',

        // 涨跌色（增强对比）
        'rise': '#ff4757',
        'fall': '#2ed573',

        // 霓虹色系
        'neon-green': '#00ff88',
        'neon-red': '#ff4757',
        'neon-blue': '#00d4ff',
        'neon-purple': '#7c4dff',
        'neon-gold': '#ffd700',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'flash-rise': 'flash-rise 0.5s ease-out',
        'flash-fall': 'flash-fall 0.5s ease-out',
        'digit-scroll': 'digit-scroll 0.3s ease-out',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'flash-rise': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(255, 71, 87, 0.2)' },
        },
        'flash-fall': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(46, 213, 115, 0.2)' },
        },
        'digit-scroll': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '50%': { opacity: '0.5', transform: 'translateY(-8px)' },
          '51%': { opacity: '0.5', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
