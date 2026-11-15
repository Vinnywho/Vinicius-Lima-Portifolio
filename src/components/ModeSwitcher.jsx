import { Code2, Palette, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ModeSwitcher() {
  const { mode, switchMode, t } = useApp();

  return (
    <div className="mode-switcher-container">
      <div className="mode-switcher-card" role="group" aria-label={t.nav.modeLabel}>
        <button
          type="button"
          className={`mode-switch-option dev-option ${mode === 'dev' ? 'is-active' : ''}`}
          onClick={() => switchMode('dev')}
          aria-pressed={mode === 'dev'}
        >
          <div className="mode-option-icon">
            <Code2 size={18} />
          </div>
          <div className="mode-option-meta">
            <span className="mode-option-title">{t.nav.devMode}</span>
            <span className="mode-option-tag">Fullstack & Code</span>
          </div>
        </button>

        <button
          type="button"
          className={`mode-switch-option design-option ${mode === 'design' ? 'is-active' : ''}`}
          onClick={() => switchMode('design')}
          aria-pressed={mode === 'design'}
        >
          <div className="mode-option-icon">
            <Palette size={18} />
          </div>
          <div className="mode-option-meta">
            <span className="mode-option-title">{t.nav.designMode}</span>
            <span className="mode-option-tag">UI/UX & Graffiti</span>
          </div>
        </button>
      </div>

      <div className="mode-switcher-hint">
        <Sparkles size={13} style={{ color: 'var(--accent)' }} />
        <span>Clique para transicionar o site completo</span>
      </div>
    </div>
  );
}
