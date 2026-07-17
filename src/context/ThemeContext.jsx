/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';

/**
 * @typedef {Object} ThemeContextValue
 * @property {boolean} isDarkMode - Whether dark mode is currently active.
 * @property {function(): void} toggleTheme - Toggles between light and dark mode.
 */

/** localStorage key for persisting theme preference. */
const THEME_KEY = 'startup_crm_theme';

/**
 * React Context object for theme state.
 * Consumer components access this via the useTheme() hook.
 */
export const ThemeContext = createContext(/** @type {ThemeContextValue|undefined} */ (undefined));

/**
 * ThemeProvider Component
 * Manages the isDarkMode boolean state and applies/removes the 'dark' class
 * on document.documentElement so Tailwind's dark: variants take effect.
 *
 * Initializes from localStorage if a previous preference was saved, otherwise defaults to light.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored !== null) return stored === 'dark';
    } catch {
      // ignore
    }
    return false;
  });

  // Apply or remove the 'dark' class on <html> and persist preference
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  /**
   * Toggles the current theme between light and dark mode.
   */
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  /** @type {ThemeContextValue} */
  const value = { isDarkMode, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to consume the ThemeContext.
 * Throws a descriptive error if called outside a ThemeProvider.
 *
 * @returns {ThemeContextValue} The theme context value.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useTheme() must be used within a <ThemeProvider>. ' +
      'Wrap your component tree with <ThemeProvider> in main.jsx or App.jsx.'
    );
  }
  return context;
}
