/**
 * theme.js — lightweight global theme manager (no React Context needed).
 *
 * Usage:
 *   import { useTheme, setTheme } from './theme';
 *   const { theme, setTheme } = useTheme();
 */
import { useState, useEffect } from 'react';

const THEME_KEY  = 'lms_theme';
const _listeners = new Set();

// Read saved preference; fall back to system preference, then 'light'
function _getInitial() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

let _theme = _getInitial();

function _applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// Apply immediately on module load so the page never flickers
_applyTheme(_theme);

/** Set and persist the theme ('light' | 'dark' | 'system'). */
export function setTheme(theme) {
  let resolved = theme;
  if (theme === 'system') {
    resolved = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  _theme = resolved;
  localStorage.setItem(THEME_KEY, theme); // save the user's choice, not resolved
  _applyTheme(resolved);
  _listeners.forEach(fn => fn(resolved));
}

export function getTheme() { return _theme; }
export function getSavedChoice() { return localStorage.getItem(THEME_KEY) || 'light'; }

/** React hook — re-renders the caller when the theme changes. */
export function useTheme() {
  const [theme, setLocal] = useState(_theme);
  useEffect(() => {
    const fn = t => setLocal(t);
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  }, []);
  return { theme, setTheme };
}
