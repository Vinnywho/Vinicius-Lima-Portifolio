import { useEffect, useRef } from 'react';

/**
 * Efeito sutil de granulação animada (Noise) no background, inspirado no React Bits.
 */
export default function Noise({
  patternSize = 512,
  patternRefreshInterval = 3,
  patternAlpha = 16,
}) {
  const grainRef = useRef(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = patternSize;
    canvas.height = patternSize;

    const imageData = ctx.createImageData(patternSize, patternSize);
    const buffer32 = new Uint32Array(imageData.data.buffer);
    const alphaMask = (patternAlpha & 0xff) << 24;

    const drawGrain = () => {
      for (let i = 0; i < buffer32.length; i++) {
        const v = (Math.random() * 255) | 0;
        buffer32[i] = alphaMask | (v << 16) | (v << 8) | v;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    drawGrain();

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let frame = 0;
    let animationId = 0;

    const loop = () => {
      if (!document.hidden && frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    animationId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternRefreshInterval, patternAlpha]);

  return <canvas ref={grainRef} className="noise-overlay no-print" aria-hidden="true" />;
}
