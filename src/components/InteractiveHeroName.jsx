import { useCallback, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';

const SAFE_NARROW_DEV_CHARS = 'IJLT17!()[]{}|/:;';
const SAFE_WIDE_DEV_CHARS = 'ABCDEFGHKMNOPQRSTUVWXYZ02345689%&*+-<=>?@^_~';
const NARROW_SOURCE_SET = new Set(['I', 'i', 'l', 'L', '1', 't', 'j']);

const checkReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function InteractiveHeroName({ text }) {
  const { mode } = useApp();

  const stageRef = useRef(null);
  const charCellsRef = useRef([]);
  const charMainsRef = useRef([]);
  const charTimersRef = useRef(new Map());
  const waveTimersRef = useRef([]);
  const hoveredIndexRef = useRef(null);

  const { words, totalChars } = useMemo(() => {
    let globalIndex = 0;
    const mapped = text.split(' ').map((word) => {
      const chars = Array.from(word).map((char) => {
        const idx = globalIndex;
        globalIndex += 1;
        return { char, index: idx };
      });
      return chars;
    });
    return { words: mapped, totalChars: globalIndex };
  }, [text]);

  const pickSafeGlyph = useCallback((sourceChar) => {
    const pool = NARROW_SOURCE_SET.has(sourceChar)
      ? SAFE_NARROW_DEV_CHARS
      : SAFE_WIDE_DEV_CHARS;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const clearCharTimers = useCallback((index) => {
    const timers = charTimersRef.current.get(index);
    if (timers) {
      timers.forEach((id) => clearTimeout(id));
      charTimersRef.current.delete(index);
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    charTimersRef.current.forEach((timers) => {
      timers.forEach((id) => clearTimeout(id));
    });
    charTimersRef.current.clear();

    waveTimersRef.current.forEach((id) => clearTimeout(id));
    waveTimersRef.current = [];
  }, []);

  const restoreChar = useCallback((index) => {
    const el = charMainsRef.current[index];
    if (el && el.dataset.char) {
      el.textContent = el.dataset.char;
    }
  }, []);

  const restoreAllChars = useCallback(() => {
    charMainsRef.current.forEach((el) => {
      if (el && el.dataset.char) {
        el.textContent = el.dataset.char;
      }
    });
  }, []);

  const resetCharTransform = useCallback((index, immediate = false) => {
    const mainEl = charMainsRef.current[index];
    if (!mainEl) return;

    gsap.killTweensOf(mainEl);

    if (immediate || checkReducedMotion()) {
      gsap.set(mainEl, { y: 0, scale: 1, rotation: 0, skewX: 0, opacity: 1 });
      return;
    }

    gsap.to(mainEl, {
      y: 0,
      scale: 1,
      rotation: 0,
      skewX: 0,
      opacity: 1,
      duration: 0.32,
      ease: 'power3.out',
      overwrite: true,
    });
  }, []);

  // Scramble a single character through 3 safe ASCII glyphs (Dev mode only) then restore original
  const scrambleSingleChar = useCallback(
    (index) => {
      if (mode !== 'dev') return;

      const el = charMainsRef.current[index];
      if (!el) return;

      clearCharTimers(index);

      const original = el.dataset.char || '';
      const steps = [0, 55, 110];
      const timers = [];

      steps.forEach((delay) => {
        const id = setTimeout(() => {
          if (!el.isConnected) return;
          el.textContent = pickSafeGlyph(original);
        }, delay);
        timers.push(id);
      });

      const resetId = setTimeout(() => {
        if (!el.isConnected) return;
        el.textContent = original;
        charTimersRef.current.delete(index);
      }, 165);
      timers.push(resetId);

      charTimersRef.current.set(index, timers);
    },
    [mode, clearCharTimers, pickSafeGlyph]
  );

  // Staggered wave across the whole name starting from originIndex (glyph scramble only in Dev mode)
  const triggerWaveScramble = useCallback(
    (originIndex = 0) => {
      if (checkReducedMotion()) return;

      const mains = charMainsRef.current.filter(Boolean);
      if (mains.length === 0) return;

      waveTimersRef.current.forEach((id) => clearTimeout(id));
      waveTimersRef.current = [];

      if (mode === 'dev') {
        mains.forEach((_, idx) => {
          if (idx === hoveredIndexRef.current) return;
          const delay = Math.abs(idx - originIndex) * 30;
          const id = setTimeout(() => {
            if (hoveredIndexRef.current !== idx) {
              scrambleSingleChar(idx);
            }
          }, delay);
          waveTimersRef.current.push(id);
        });
      }

      gsap.set(mains, { opacity: 1 });
      gsap.to(mains, {
        keyframes: [
          {
            y: -14,
            scale: 1.15,
            rotation: (i) => (i % 2 === 0 ? -6 : 6),
            duration: 0.14,
            ease: 'power2.out',
          },
          {
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.42,
            ease: 'back.out(1.8)',
          },
        ],
        stagger: { each: 0.03, from: originIndex },
        overwrite: true,
        onComplete: () => {
          mains.forEach((el, idx) => {
            if (idx !== hoveredIndexRef.current) {
              gsap.set(el, { y: 0, scale: 1, rotation: 0, skewX: 0, opacity: 1 });
            }
          });
        },
      });
    },
    [mode, scrambleSingleChar]
  );

  // Choreographed entrance + periodic automatic glitch/scramble loop (Dev mode only)
  useEffect(() => {
    charCellsRef.current.length = totalChars;
    charMainsRef.current.length = totalChars;

    const mains = charMainsRef.current.filter(Boolean);
    if (mains.length === 0) return;

    hoveredIndexRef.current = null;
    clearAllTimers();
    restoreAllChars();

    if (checkReducedMotion()) {
      gsap.set(mains, { opacity: 1, clearProps: 'transform' });
      return;
    }

    let intervalId = null;
    let tickCount = 0;

    const ctx = gsap.context(() => {
      gsap.set(mains, { opacity: 1 });
      gsap.from(mains, {
        y: 22,
        scale: 0.88,
        duration: 0.62,
        stagger: 0.03,
        ease: 'back.out(1.6)',
        clearProps: 'transform',
      });

      if (mode === 'dev') {
        intervalId = setInterval(() => {
          if (typeof document !== 'undefined' && document.hidden) return;
          tickCount += 1;

          // Every 3rd tick runs a full sweeping wave; otherwise glitch 2-4 random letters
          if (tickCount % 3 === 0) {
            triggerWaveScramble(0);
            return;
          }

          const count = Math.min(mains.length, 2 + Math.floor(Math.random() * 3));
          const chosen = new Set();
          let guard = 0;
          while (chosen.size < count && guard < mains.length * 4) {
            guard += 1;
            const candidate = Math.floor(Math.random() * mains.length);
            if (candidate !== hoveredIndexRef.current) {
              chosen.add(candidate);
            }
          }

          chosen.forEach((idx) => {
            if (idx === hoveredIndexRef.current) return;
            const mainEl = charMainsRef.current[idx];
            if (!mainEl) return;

            scrambleSingleChar(idx);
            gsap.to(mainEl, {
              keyframes: [
                { y: -8, scale: 1.1, skewX: -8, duration: 0.09, ease: 'power2.out' },
                { y: 2, scale: 0.98, skewX: 6, duration: 0.09, ease: 'power1.inOut' },
                { y: 0, scale: 1, skewX: 0, duration: 0.28, ease: 'back.out(2)' },
              ],
              overwrite: true,
              onComplete: () => {
                if (idx !== hoveredIndexRef.current) {
                  gsap.set(mainEl, { y: 0, scale: 1, skewX: 0, opacity: 1 });
                }
              },
            });
          });
        }, 3600);
      }
    }, stageRef);

    return () => {
      if (intervalId) clearInterval(intervalId);
      clearAllTimers();
      restoreAllChars();
      hoveredIndexRef.current = null;
      ctx.revert();
    };
  }, [text, mode, totalChars, clearAllTimers, restoreAllChars, scrambleSingleChar, triggerWaveScramble]);

  // Letter-by-letter hover (animates inner glyph while keeping outer hit cell stationary)
  const handleCharEnter = (e, index) => {
    if (e && e.pointerType === 'touch') return;
    if (checkReducedMotion()) return;

    if (hoveredIndexRef.current !== null && hoveredIndexRef.current !== index) {
      const prevIdx = hoveredIndexRef.current;
      clearCharTimers(prevIdx);
      restoreChar(prevIdx);
      resetCharTransform(prevIdx);
    }

    hoveredIndexRef.current = index;

    if (mode === 'dev') {
      scrambleSingleChar(index);
    }

    const mainEl = charMainsRef.current[index];
    if (!mainEl) return;

    gsap.killTweensOf(mainEl);
    gsap.to(mainEl, {
      y: -12,
      scale: 1.16,
      rotation: index % 2 === 0 ? -5 : 5,
      opacity: 1,
      duration: 0.22,
      ease: 'back.out(2)',
      overwrite: true,
    });
  };

  const handleCharLeave = (index) => {
    if (hoveredIndexRef.current === index) {
      hoveredIndexRef.current = null;
    }

    clearCharTimers(index);
    restoreChar(index);
    resetCharTransform(index);
  };

  const handleStageLeave = () => {
    hoveredIndexRef.current = null;
    clearAllTimers();
    restoreAllChars();
    charMainsRef.current.forEach((_, idx) => {
      resetCharTransform(idx);
    });
  };

  return (
    <div ref={stageRef} className="hero-name-stage hero-animate" data-no-spray="true">
      <h1
        className="hero-title interactive-hero-name"
        aria-label={text}
        onPointerLeave={handleStageLeave}
        onPointerCancel={handleStageLeave}
      >
        <span className="sr-only">{text}</span>

        {words.map((wordChars, wIdx) => (
          <span key={`${mode}-word-${wIdx}`} className="hero-word" aria-hidden="true">
            {wordChars.map(({ char, index }) => (
              <span
                key={`${mode}-char-${index}`}
                ref={(el) => {
                  charCellsRef.current[index] = el;
                }}
                className="hero-char-cell"
                data-char-index={index}
                onPointerEnter={(e) => handleCharEnter(e, index)}
                onPointerLeave={() => handleCharLeave(index)}
                onClick={() => triggerWaveScramble(index)}
              >
                <span className="hero-char-sizer" aria-hidden="true">
                  {char}
                </span>
                <span
                  ref={(el) => {
                    charMainsRef.current[index] = el;
                  }}
                  className="hero-char-main"
                  data-char={char}
                >
                  {char}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h1>
    </div>
  );
}
