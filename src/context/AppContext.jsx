import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { translations } from '../data/translations';

const AppContext = createContext(null);

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('color-scheme');
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // ignore storage errors
  }
  return 'light';
}

function getInitialMode() {
  try {
    const stored = localStorage.getItem('portfolio-mode');
    if (stored === 'dev' || stored === 'design') return stored;
  } catch {
    // ignore
  }
  return 'dev';
}

function getInitialLang() {
  try {
    const stored = localStorage.getItem('portfolio-lang');
    if (stored === 'pt' || stored === 'en') return stored;
  } catch {
    // ignore
  }
  return 'pt';
}

export function AppProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);
  const [theme, setTheme] = useState(getInitialTheme);
  const [lang, setLang] = useState(getInitialLang);
  const [menuOpen, setMenuOpen] = useState(false);
  const [transitionState, setTransitionState] = useState({
    active: false,
    targetMode: null,
  });

  const transitionTimeoutRef = useRef(null);

  // Sync theme to DOM & meta color-scheme
  useEffect(() => {
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', theme);
    }
    document.documentElement.dataset.theme = theme;
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    try {
      localStorage.setItem('color-scheme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Sync mode (dev | design) to DOM
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try {
      localStorage.setItem('portfolio-mode', mode);
    } catch {
      // ignore
    }
  }, [mode]);

  // Sync language to <html lang="...">
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    try {
      localStorage.setItem('portfolio-lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Sync theme across browser tabs via storage event
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'color-scheme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue);
      }
      if (e.key === 'portfolio-mode' && (e.newValue === 'dev' || e.newValue === 'design')) {
        setMode(e.newValue);
      }
      if (e.key === 'portfolio-lang' && (e.newValue === 'pt' || e.newValue === 'en')) {
        setLang(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'pt' ? 'en' : 'pt'));
  }, []);

  // Fluid mode transition coordinated with ModeTransition component
  const switchMode = useCallback(
    (nextMode) => {
      const target = nextMode || (mode === 'dev' ? 'design' : 'dev');
      if (target === mode || transitionState.active) return;

      const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setMode(target);
        return;
      }

      setTransitionState({ active: true, targetMode: target });

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // Midpoint swap happens when GSAP curtain covers screen (~420ms)
      transitionTimeoutRef.current = setTimeout(() => {
        setMode(target);
      }, 420);
    },
    [mode, transitionState.active]
  );

  const finishTransition = useCallback(() => {
    setTransitionState({ active: false, targetMode: null });
  }, []);

  const t = translations[lang];

  // Helper to resolve bilingual objects { pt: '...', en: '...' } or plain strings
  const tr = useCallback(
    (value) => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && (value.pt !== undefined || value.en !== undefined)) {
        return value[lang] ?? value.pt ?? value.en ?? '';
      }
      return value;
    },
    [lang]
  );

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        switchMode,
        transitionState,
        finishTransition,
        theme,
        setTheme,
        toggleTheme,
        lang,
        setLang,
        toggleLang,
        menuOpen,
        setMenuOpen,
        t,
        tr,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
