import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = (localStorage.getItem('theme') || 'light').trim();
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('prefs')) || { compactSidebar: false, enableNotifications: true }; }
    catch { return { compactSidebar: false, enableNotifications: true }; }
  });

  const applyTheme = (value) => {
    const root = document.documentElement;
    if (value === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', value);
  };

  // Apply immediately on first paint to avoid flicker and incorrect default
  useLayoutEffect(() => {
    applyTheme(theme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('prefs', JSON.stringify(prefs));
  }, [prefs]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(() => ({ theme, setTheme, toggleTheme, prefs, setPrefs }), [theme, prefs]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
