import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';

export default function ModeTransition() {
  const { transitionState, finishTransition, t } = useApp();
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!transitionState.active) return;

    const root = rootRef.current;
    const bg = bgRef.current;
    const label = labelRef.current;
    if (!root || !bg || !label) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { visibility: 'hidden' });
        finishTransition();
      },
    });

    tl.set(root, { visibility: 'visible' })
      .fromTo(
        bg,
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: 0.4, ease: 'power3.inOut' }
      )
      .fromTo(
        label,
        { opacity: 0, y: 24, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'back.out(1.6)' },
        '-=0.1'
      )
      .to(label, { opacity: 0, y: -20, duration: 0.2, delay: 0.15 })
      .to(
        bg,
        { scaleY: 0, transformOrigin: 'top', duration: 0.42, ease: 'power3.inOut' },
        '-=0.05'
      );

    return () => {
      tl.kill();
    };
  }, [transitionState.active, finishTransition]);

  const targetLabel =
    transitionState.targetMode === 'design' ? t.nav.designMode : t.nav.devMode;

  return (
    <div
      ref={rootRef}
      className="mode-curtain"
      data-target={transitionState.targetMode || 'dev'}
      aria-hidden="true"
    >
      <div ref={bgRef} className="mode-curtain-bg" />
      <div ref={labelRef} className="mode-curtain-label">
        {targetLabel}
      </div>
    </div>
  );
}
