import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AppTheme = 'light' | 'dark';

function readStoredTheme(): AppTheme {
  if (typeof window === 'undefined') return 'dark';
  const raw = localStorage.getItem('theme');
  if (raw === 'light' || raw === 'dark') return raw;
  return 'dark';
}

function applyThemeClass(next: AppTheme) {
  if (next === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

type ThemeContextValue = {
  theme: AppTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(() => readStoredTheme());

  useLayoutEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  useLayoutEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'theme' || !e.newValue) return;
      if (e.newValue === 'light' || e.newValue === 'dark') {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyThemeClass(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return createElement(ThemeContext.Provider, { value }, children);
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return ctx;
};
