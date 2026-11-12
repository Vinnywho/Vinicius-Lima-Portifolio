import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // ignore
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
  const navigate = useNavigate();
  const [mode, setMode] = useState(getInitialMode);
  const [theme, setTheme] = useState(getInitialTheme);
  const [lang, setLang] = useState(getInitialLang);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transition state com chave única a cada execução para nunca falhar em trocas repetidas
  const [transitionState, setTransitionState] = useState({
    active: false,
    key: 0,
    type: 'mode', // 'mode' | 'nav'
    targetMode: null,
    targetPath: null,
  });

  const isTransitioningRef = useRef(false);

  // Sync theme
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

  // Sync mode
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try {
      localStorage.setItem('portfolio-mode', mode);
    } catch {
      // ignore
    }
  }, [mode]);

  // Sync language
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    try {
      localStorage.setItem('portfolio-lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Cross-tab storage sync
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

  // Transição de Modo com duração expressiva e execução a cada clique
  const switchMode = useCallback(
    (nextMode) => {
      const target = nextMode || (mode === 'dev' ? 'design' : 'dev');
      if (target === mode || isTransitioningRef.current) return;

      const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setMode(target);
        return;
      }

      isTransitioningRef.current = true;
      setTransitionState((prev) => ({
        active: true,
        key: prev.key + 1,
        type: 'mode',
        targetMode: target,
        targetPath: null,
      }));
    },
    [mode]
  );

  // Navegação entre rotas com a cortina de transição de projeto
  const navigateWithTransition = useCallback(
    (path) => {
      if (!path || isTransitioningRef.current) return;

      const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      isTransitioningRef.current = true;
      setTransitionState((prev) => ({
        active: true,
        key: prev.key + 1,
        type: 'nav',
        targetMode: mode,
        targetPath: path,
      }));
    },
    [mode, navigate]
  );

  const transitionRef = useRef(transitionState);
  useEffect(() => {
    transitionRef.current = transitionState;
  }, [transitionState]);

  // Chamado no meio da animação (quando a cortina cobre a tela inteira)
  const applyTransitionMidpoint = useCallback(() => {
    const current = transitionRef.current;
    if (current.type === 'mode' && current.targetMode) {
      setMode(current.targetMode);
    } else if (current.type === 'nav' && current.targetPath) {
      navigate(current.targetPath);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [navigate]);

  const finishTransition = useCallback(() => {
    isTransitioningRef.current = false;
    setTransitionState((prev) => ({
      ...prev,
      active: false,
    }));
  }, []);

  const t = translations[lang];

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
        navigateWithTransition,
        transitionState,
        applyTransitionMidpoint,
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
