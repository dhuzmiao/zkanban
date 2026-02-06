import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg glass-card hover:border-white/20 transition-all"
      aria-label="切换主题"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
