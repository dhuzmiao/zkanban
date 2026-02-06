import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 初始化时同步设置主题，避免闪烁
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    // 立即设置 HTML class，避免首次渲染闪烁
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return savedTheme;
  });

  useEffect(() => {
    // 保存主题到 localStorage
    localStorage.setItem('theme', theme);
    // 更新 document 的 class - 使用标准的 Tailwind dark 模式
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
