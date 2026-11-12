import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';

export default function ModeTransition() {
  const { transitionState, applyTransitionMidpoint, finishTransition, lang } = useApp();
  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const badgeRef = useRef(null);

  const midpointRef = useRef(applyTransitionMidpoint);
  const finishRef = useRef(finishTransition);
  const stateRef = useRef(transitionState);

  useEffect(() => {
    midpointRef.current = applyTransitionMidpoint;
    finishRef.current = finishTransition;
    stateRef.current = transitionState;
  });

  useEffect(() => {
    if (!transitionState.active || transitionState.key === 0) return;

    const root = rootRef.current;
    const curtain = curtainRef.current;
    const badge = badgeRef.current;
    const current = stateRef.current;
    const isDesign = current.targetMode === 'design';

    if (!root || !curtain || !badge) return;

    // Reset limpo do estado do GSAP
    gsap.killTweensOf([root, curtain, badge]);
    gsap.set(root, { visibility: 'visible', opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { visibility: 'hidden' });
        finishRef.current?.();
      },
    });

    if (isDesign) {
      // Animação de ESTÚDIO / ARTE URBANA AZUL
      tl.set(curtain, {
        backgroundColor: '#0066ff',
        clipPath: 'circle(0% at 50% 50%)',
      })
        .to(curtain, {
          clipPath: 'circle(150% at 50% 50%)',
          duration: 0.52,
          ease: 'power3.inOut',
          onComplete: () => {
            midpointRef.current?.();
          },
        })
        .fromTo(
          badge,
          { scale: 0.75, opacity: 0, rotate: -4 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.35, ease: 'back.out(2)' },
          '-=0.22'
        )
        // Mantém na tela um instante para leitura e apreciação visual
        .to(badge, { opacity: 0, scale: 1.15, duration: 0.28, delay: 0.25 })
        .to(curtain, {
          clipPath: 'circle(0% at 50% 50%)',
          duration: 0.48,
          ease: 'power3.inOut',
        });
    } else {
      // Animação DEV SCANLINES / MATRIX PIXEL
      tl.set(curtain, {
        backgroundColor: '#0c0d12',
        scaleY: 0,
        transformOrigin: 'top',
      })
        .to(curtain, {
          scaleY: 1,
          duration: 0.48,
          ease: 'power4.inOut',
          onComplete: () => {
            midpointRef.current?.();
          },
        })
        .fromTo(
          badge,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'steps(4)' },
          '-=0.18'
        )
        // Mantém na tela para visualização da mensagem
        .to(badge, { opacity: 0, y: -25, duration: 0.25, delay: 0.25 })
        .to(curtain, {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.48,
          ease: 'power4.inOut',
        });
    }

    return () => {
      tl.kill();
    };
  }, [transitionState.key, transitionState.active]);

  if (!transitionState.active) return null;

  const isNav = transitionState.type === 'nav';
  const isTargetDesign = transitionState.targetMode === 'design';

  return (
    <div ref={rootRef} className="mode-transition-root" aria-hidden="true">
      <div ref={curtainRef} className="mode-transition-curtain">
        {isTargetDesign ? (
          <div className="mode-spray-burst">
            <div className="spray-drip-stream" />
            <div className="spray-drip-stream" style={{ left: '65%', animationDelay: '0.15s' }} />
          </div>
        ) : (
          <div className="mode-matrix-scan">
            <div className="matrix-code-ticker">
              {'<COMPILING RUNTIME /> 01001011 01101001 01110111 01101001 • GSAP_ENGINE_READY'}
            </div>
          </div>
        )}

        <div ref={badgeRef} className="mode-transition-badge">
          {isNav ? (
            <div className={isTargetDesign ? 'badge-design-mode' : 'badge-dev-mode'}>
              <span className={isTargetDesign ? 'badge-design-sub' : 'badge-dev-sub'}>
                {lang === 'pt' ? 'CARREGANDO EXPERIÊNCIA...' : 'LOADING CASE STUDY...'}
              </span>
              <h2 className={isTargetDesign ? 'badge-design-title' : 'badge-dev-title'}>
                {isTargetDesign ? 'SHOWCASE VISUAL' : '<PROJETO />'}
              </h2>
            </div>
          ) : isTargetDesign ? (
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
