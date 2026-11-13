import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { skills, designCapabilities } from '../data/skills';

export default function MobileSkillsMarquee() {
  const { mode, lang, t, tr } = useApp();
  const [selected, setSelected] = useState(null);

  const items = mode === 'dev' ? skills : designCapabilities;
  const mid = Math.ceil(items.length / 2);
  const rowA = items.slice(0, mid);
  const rowB = items.slice(mid).length > 0 ? items.slice(mid) : items;

  const renderTrack = (list, direction) => {
    const doubled = [...list, ...list];
    return (
      <div className="mobile-marquee-viewport">
        <div className={`mobile-marquee-track ${direction}`}>
          {doubled.map((item, idx) => {
            const isActive = selected?.id === item.id;
            return (
              <button
                key={`${item.id}-${idx}`}
                type="button"
                className={`mobile-marquee-pill ${isActive ? 'is-active' : ''}`}
                style={{ '--pill-color': item.color || 'var(--accent)' }}
                onClick={() => setSelected(isActive ? null : item)}
              >
                {item.icon && (
                  <span className="mobile-marquee-icon-wrap">
                    <img src={item.icon} alt="" className="mobile-marquee-icon" />
                  </span>
                )}
                <span className="mobile-marquee-name">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-skills-marquee" data-no-spray="true">
      <div className="mobile-marquee-label">
        <Sparkles size={13} />
        <span>
          {mode === 'dev' ? t.hero.phoneTitleDev : t.hero.phoneTitleDesign}
        </span>
      </div>

      <div className="mobile-marquee-rows">
        {renderTrack(rowA, 'is-left')}
        {renderTrack(rowB, 'is-right')}
      </div>

      <p className="mobile-marquee-hint">
        {lang === 'pt'
          ? 'Toque em qualquer item para ver detalhes'
          : 'Tap any item to see details'}
      </p>

      {selected && (
        <div className="mobile-marquee-detail" role="region" aria-live="polite">
          <div className="mobile-marquee-detail-head">
            <div className="mobile-marquee-detail-title">
              {selected.icon && (
                <img src={selected.icon} alt="" className="mobile-marquee-detail-icon" />
              )}
              <strong>{selected.name}</strong>
            </div>
            <button
              type="button"
              className="mobile-marquee-close"
              onClick={() => setSelected(null)}
              aria-label={t.hero.phoneCloseCard}
            >
              <X size={16} />
            </button>
          </div>

          <div className="mobile-marquee-meter">
            <div className="mobile-marquee-meter-labels">
              <span>{t.hero.phoneLevel}</span>
              <span>{selected.level}%</span>
            </div>
            <div className="mobile-marquee-meter-bar">
              <div
                className="mobile-marquee-meter-fill"
                style={{ width: `${selected.level}%` }}
              />
            </div>
          </div>

          <p className="mobile-marquee-detail-desc">{tr(selected.description)}</p>
        </div>
      )}
    </div>
  );
}
