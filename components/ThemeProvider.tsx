'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  systemTheme: 'light' | 'dark';
  isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES = ['emerald', 'forest', 'lofi', 'corporate', 'synthwave', 'valentine', 'aqua', 'dracula'] as const;
const LIGHT_THEMES = ['emerald', 'lofi', 'corporate', 'valentine', 'aqua'] as const;
const DARK_THEMES = ['forest', 'synthwave', 'dracula'] as const;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState('emerald');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // If theme is already set by blocking script, use it
    if (currentTheme) {
      setThemeState(currentTheme);
      setIsSystemTheme(false);
      return;
    }
    
    if (storedTheme && THEMES.includes(storedTheme as typeof THEMES[number])) {
      // User has explicitly set a theme - override automatic system
      setThemeState(storedTheme);
      setIsSystemTheme(false);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else {
      // Use automatic system theme
      const autoTheme = systemTheme === 'dark' ? 'forest' : 'emerald';
      setThemeState(autoTheme);
      setIsSystemTheme(true);
      // Remove data-theme to let DaisyUI handle automatic switching
      document.documentElement.removeAttribute('data-theme');
    }
  }, [systemTheme]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    setIsSystemTheme(false);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      systemTheme,
      isSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { THEMES, LIGHT_THEMES, DARK_THEMES };
