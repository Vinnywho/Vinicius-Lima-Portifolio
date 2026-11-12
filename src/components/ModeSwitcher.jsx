import { Code2, Palette } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ModeSwitcher() {
  const { mode, switchMode, t } = useApp();

  return (
    <div className="mode-switcher" role="group" aria-label={t.nav.modeLabel}>
      <button
        type="button"
        className={`mode-switch-btn ${mode === 'dev' ? 'is-active' : ''}`}
        onClick={() => switchMode('dev')}
        aria-pressed={mode === 'dev'}
      >
        <Code2 size={16} />
        <span>{t.nav.devMode}</span>
      </button>
      <button
        type="button"
        className={`mode-switch-btn ${mode === 'design' ? 'is-active' : ''}`}
        onClick={() => switchMode('design')}
        aria-pressed={mode === 'design'}
      >
        <Palette size={16} />
        <span>{t.nav.designMode}</span>
      </button>
    </div>
  );
}
