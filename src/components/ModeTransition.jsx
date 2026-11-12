import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';

export default function ModeTransition() {
  const { transitionState, finishTransition } = useApp();
  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const badgeRef = useRef(null);
  const matrixLinesRef = useRef(null);
  const sprayGraphicRef = useRef(null);

  useEffect(() => {
    if (!transitionState.active) return;

    const root = rootRef.current;
    const curtain = curtainRef.current;
    const badge = badgeRef.current;
    const isTargetDesign = transitionState.targetMode === 'design';

    if (!root || !curtain || !badge) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { visibility: 'hidden' });
        finishTransition();
      },
    });

    tl.set(root, { visibility: 'visible' });

    if (isTargetDesign) {
      // Transição para DESIGN: Spray de arte urbana azul + revelação gráfica
      tl.fromTo(
        curtain,
        { clipPath: 'circle(0% at 50% 50%)', backgroundColor: '#0066ff' },
        { clipPath: 'circle(150% at 50% 50%)', duration: 0.45, ease: 'power3.inOut' }
      )
        .fromTo(
          badge,
          { scale: 0.7, opacity: 0, rotate: -6 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.28, ease: 'back.out(2)' },
          '-=0.2'
        )
        .to(badge, { opacity: 0, scale: 1.15, duration: 0.22, delay: 0.15 })
        .to(
          curtain,
          { clipPath: 'circle(0% at 50% 50%)', duration: 0.42, ease: 'power3.inOut' },
          '-=0.08'
        );
    } else {
      // Transição para DEV: Scanline pixel-matrix terminal com KiwiSoda
      tl.fromTo(
        curtain,
        { scaleY: 0, transformOrigin: 'top', backgroundColor: '#0e0e0e' },
        { scaleY: 1, duration: 0.42, ease: 'power4.inOut' }
      )
        .fromTo(
          badge,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25, ease: 'steps(4)' },
          '-=0.15'
        )
        .to(badge, { opacity: 0, y: -20, duration: 0.2, delay: 0.15 })
        .to(
          curtain,
          { scaleY: 0, transformOrigin: 'bottom', duration: 0.42, ease: 'power4.inOut' },
          '-=0.05'
        );
    }

    return () => {
      tl.kill();
    };
  }, [transitionState.active, transitionState.targetMode, finishTransition]);

  const isTargetDesign = transitionState.targetMode === 'design';

  return (
    <div ref={rootRef} className="mode-transition-root" aria-hidden="true">
      <div ref={curtainRef} className="mode-transition-curtain">
        {isTargetDesign ? (
          <div ref={sprayGraphicRef} className="mode-spray-burst">
            <div className="spray-drip-stream" />
            <div className="spray-drip-stream" style={{ left: '60%', animationDelay: '0.1s' }} />
          </div>
        ) : (
          <div ref={matrixLinesRef} className="mode-matrix-scan">
            <div className="matrix-code-ticker">
              {'<BUILDING DEV_ENVIRONMENT ... STACK READY /> 01001011 01101001 01110111 01101001'}
            </div>
          </div>
        )}

        <div ref={badgeRef} className="mode-transition-badge">
          {isTargetDesign ? (
            <div className="badge-design-mode">
              <span className="badge-design-sub">ESTÚDIO DE CRIAÇÃO & UI</span>
              <h2 className="badge-design-title">ARTE & DESIGN</h2>
            </div>
          ) : (
            <div className="badge-dev-mode">
              <span className="badge-dev-sub">&gt; INITIALIZING RUNTIME...</span>
              <h2 className="badge-dev-title">&lt;FRONT-END /&gt;</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
