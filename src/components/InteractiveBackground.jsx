import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

function createDevNodes(width, height, isMobile) {
  const count = isMobile ? 22 : Math.min(54, Math.max(32, Math.floor((width * height) / 28000)));
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: 1.4 + Math.random() * 1.6,
      isAccent: i % 5 === 0,
    });
  }
  return nodes;
}

function createDesignShapes(width, height, isMobile) {
  const count = isMobile ? 8 : 16;
  const kinds = ['circle', 'square', 'diamond', 'cross'];
  const shapes = [];
  for (let i = 0; i < count; i++) {
    shapes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      size: 10 + Math.random() * 16,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.008,
      kind: kinds[i % kinds.length],
      isCyan: i % 3 === 0,
    });
  }
  return shapes;
}

export default function InteractiveBackground() {
  const { mode, theme } = useApp();
  const canvasRef = useRef(null);
  const modeRef = useRef(mode);
  const themeRef = useRef(theme);

  useEffect(() => {
    modeRef.current = mode;
    themeRef.current = theme;
  }, [mode, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width <= 768;

    let devNodes = createDevNodes(width, height, isMobile);
    let designShapes = createDesignShapes(width, height, isMobile);
    const pulses = [];

    const pointer = {
      x: width * 0.5,
      y: height * 0.45,
      active: false,
    };

    let rafId = null;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width <= 768;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      devNodes = createDevNodes(width, height, isMobile);
      designShapes = createDesignShapes(width, height, isMobile);
    };

    const drawDevFrame = () => {
      const isDark = themeRef.current === 'dark';
      const accentRgb = isDark ? '217, 38, 41' : '170, 23, 25';
      const neutralRgb = isDark ? '251, 251, 242' : '14, 14, 14';
      const linkDist = isMobile ? 115 : 145;
      const pointerDist = 185;

      // Update nodes
      for (let i = 0; i < devNodes.length; i++) {
        const n = devNodes[i];
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
          n.x = Math.max(0, Math.min(width, n.x));
          n.y = Math.max(0, Math.min(height, n.y));

          // Gentle magnetic attraction toward pointer
          if (pointer.active && !isMobile) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > 900 && distSq < pointerDist * pointerDist) {
              const dist = Math.sqrt(distSq);
              const pull = (1 - dist / pointerDist) * 0.032;
              n.x += dx * pull;
              n.y += dy * pull;
            }
          }
        }
      }

      // Draw network connections between nodes
      ctx.lineWidth = 1;
      for (let i = 0; i < devNodes.length; i++) {
        const a = devNodes[i];
        for (let j = i + 1; j < devNodes.length; j++) {
          const b = devNodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkDist * linkDist) {
            const alpha = (1 - Math.sqrt(distSq) / linkDist) * (isDark ? 0.2 : 0.16);
            const useAccent = a.isAccent || b.isAccent;
            ctx.strokeStyle = useAccent
              ? `rgba(${accentRgb}, ${alpha * 1.45})`
              : `rgba(${neutralRgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Connect nearby nodes directly to cursor
        if (pointer.active && !isMobile) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < pointerDist * pointerDist) {
            const alpha = (1 - Math.sqrt(distSq) / pointerDist) * (isDark ? 0.45 : 0.36);
            ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < devNodes.length; i++) {
        const n = devNodes[i];
        let boost = 0;
        if (pointer.active && !isMobile) {
          const dist = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (dist < pointerDist) {
            boost = 1 - dist / pointerDist;
          }
        }

        ctx.fillStyle =
          n.isAccent || boost > 0.35
            ? `rgba(${accentRgb}, ${0.42 + boost * 0.5})`
            : `rgba(${neutralRgb}, ${isDark ? 0.32 : 0.24})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + boost * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Radar click pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 4.5;
        p.alpha *= 0.94;
        if (p.alpha <= 0.02 || p.radius > p.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(${accentRgb}, ${p.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const drawDesignFrame = () => {
      const isDark = themeRef.current === 'dark';
      const blueRgb = '0, 102, 255';
      const cyanRgb = '56, 189, 248';
      const primaryRgb = isDark ? cyanRgb : blueRgb;
      const influenceRadius = 190;

      // Soft studio spotlight following cursor
      if (pointer.active && !isMobile) {
        const grad = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          240
        );
        grad.addColorStop(0, `rgba(${primaryRgb}, ${isDark ? 0.14 : 0.09})`);
        grad.addColorStop(1, `rgba(${primaryRgb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 240, 0, Math.PI * 2);
        ctx.fill();
      }

      // Interactive architectural registration (+) markers on a studio grid
      const spacing = isMobile ? 64 : 56;
      ctx.lineWidth = 1;
      for (let gx = spacing * 0.5; gx < width; gx += spacing) {
        for (let gy = spacing * 0.5; gy < height; gy += spacing) {
          let prox = 0;
          let drawX = gx;
          let drawY = gy;

          if (pointer.active && !isMobile) {
            const dx = gx - pointer.x;
            const dy = gy - pointer.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < influenceRadius * influenceRadius) {
              const dist = Math.sqrt(distSq);
              prox = 1 - dist / influenceRadius;
              // Tactile warp away from pointer
              const push = prox * 10;
              if (dist > 0.01) {
                drawX += (dx / dist) * push;
                drawY += (dy / dist) * push;
              }
            }
          }

          const arm = 2.2 + prox * 3.8;
          const alpha = (isDark ? 0.12 : 0.1) + prox * 0.42;
          ctx.strokeStyle =
            prox > 0.3
              ? `rgba(${isDark ? cyanRgb : blueRgb}, ${alpha})`
              : `rgba(${primaryRgb}, ${alpha})`;

          ctx.beginPath();
          ctx.moveTo(drawX - arm, drawY);
          ctx.lineTo(drawX + arm, drawY);
          ctx.moveTo(drawX, drawY - arm);
          ctx.lineTo(drawX, drawY + arm);
          ctx.stroke();
        }
      }

      // Floating studio vector primitives
      for (let i = 0; i < designShapes.length; i++) {
        const s = designShapes[i];
        if (!prefersReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          s.rotation += s.vRot;

          if (s.x < -30) s.x = width + 30;
          if (s.x > width + 30) s.x = -30;
          if (s.y < -30) s.y = height + 30;
          if (s.y > height + 30) s.y = -30;

          if (pointer.active && !isMobile) {
            const dx = s.x - pointer.x;
            const dy = s.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 1 && dist < influenceRadius) {
              const repel = (1 - dist / influenceRadius) * 0.9;
              s.x += (dx / dist) * repel;
              s.y += (dy / dist) * repel;
              s.rotation += 0.02 * (1 - dist / influenceRadius);
            }
          }
        }

        const shapeRgb = s.isCyan ? cyanRgb : blueRgb;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.strokeStyle = `rgba(${shapeRgb}, ${isDark ? 0.24 : 0.2})`;
        ctx.lineWidth = 1.4;

        if (s.kind === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 0.55, 0, Math.PI * 2);
          ctx.stroke();
        } else if (s.kind === 'square' || s.kind === 'diamond') {
          const half = s.size * 0.5;
          if (s.kind === 'diamond') ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-half, -half, s.size, s.size);
        } else {
          const arm = s.size * 0.55;
          ctx.beginPath();
          ctx.moveTo(-arm, 0);
          ctx.lineTo(arm, 0);
          ctx.moveTo(0, -arm);
          ctx.lineTo(0, arm);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Geometric click pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 4;
        p.alpha *= 0.94;
        if (p.alpha <= 0.02 || p.radius > p.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.radius * 0.01);
        ctx.strokeStyle = `rgba(${primaryRgb}, ${p.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
        ctx.restore();
      }
    };

    const render = () => {
      if (typeof document !== 'undefined' && document.hidden) {
        rafId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (modeRef.current === 'design') {
        drawDesignFrame();
      } else {
        drawDevFrame();
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onPointerDown = (e) => {
      if (prefersReducedMotion) return;
      const x = e.clientX;
      const y = e.clientY;
      pulses.push({ x, y, radius: 6, maxRadius: isMobile ? 95 : 150, alpha: 0.65 });
      if (pulses.length > 6) pulses.shift();

      if (modeRef.current === 'dev') {
        for (let i = 0; i < devNodes.length; i++) {
          const n = devNodes[i];
          const dx = n.x - x;
          const dy = n.y - y;
          const dist = Math.hypot(dx, dy);
          if (dist > 1 && dist < 160) {
            const kick = (1 - dist / 160) * 3.5;
            n.x += (dx / dist) * kick;
            n.y += (dy / dist) * kick;
          }
        }
      }
    };

    resize();
    render();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [mode]);

  return <canvas ref={canvasRef} className="interactive-bg-canvas" aria-hidden="true" />;
}
