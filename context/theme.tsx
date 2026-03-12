import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppThemeColors, AppThemeName } from '@/constants/app-theme';

type ThemeContextValue = {
  theme: AppThemeName;
  isDark: boolean;
  colors: (typeof AppThemeColors)['light'];
  setTheme: (theme: AppThemeName) => void;
  toggleTheme: () => void;
  isReady: boolean;
};

const THEME_STORAGE_KEY = 'buildonbudget.theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppThemeName>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (!isMounted) return;
        if (stored === 'light' || stored === 'dark') {
          setThemeState(stored);
        }
      })
      .finally(() => {
        if (isMounted) setIsReady(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const setTheme = (next: AppThemeName) => {
    setThemeState(next);
    void AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      colors: AppThemeColors[theme],
      setTheme,
      toggleTheme,
      isReady,
    }),
    [theme, isReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within AppThemeProvider');
  }
  return context;
}
