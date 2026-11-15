import { useState, useRef, useEffect, useCallback, useMemo, useId } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowDown,
  Download,
  Mail,
  RotateCcw,
  Undo2,
  Redo2,
  Sparkles,
  Droplets,
  Copy,
  Check,
  X,
  ExternalLink,
  Palette,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/profile';

import blankWallImg from '../assets/backgrounds-spray-lab/blank-wall-building.jpg';
import grungeWallImg from '../assets/backgrounds-spray-lab/grunge-wall-texture.jpg';
import brickWallImg from '../assets/backgrounds-spray-lab/Paredes_de_Tijolo_Aparente_-_Dicas_de_Tratamento_e_Manuten____o-1.jpg';
import whiteBrickImg from '../assets/backgrounds-spray-lab/shabby-damaged-white-brick-wall.jpg';

gsap.registerPlugin(ScrollTrigger);

const SPRAY_COLORS = [
  { id: 'red', name: 'Vermelho Autoral', hex: '#aa1719', rgb: { r: 170, g: 23, b: 25 } },
  { id: 'blue', name: 'Azul Cobalto', hex: '#0066ff', rgb: { r: 0, g: 102, b: 255 } },
  { id: 'cyan', name: 'Ciano Elétrico', hex: '#00e5ff', rgb: { r: 0, g: 229, b: 255 } },
  { id: 'pink', name: 'Rosa Tóquio', hex: '#ff007f', rgb: { r: 255, g: 0, b: 127 } },
  { id: 'gold', name: 'Ouro Urbano', hex: '#ffd700', rgb: { r: 255, g: 215, b: 0 } },
  { id: 'green', name: 'Verde Lima', hex: '#10b981', rgb: { r: 16, g: 185, b: 129 } },
  { id: 'white', name: 'Branco Puro', hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } },
  { id: 'black', name: 'Preto Grafite', hex: '#121214', rgb: { r: 18, g: 18, b: 20 } },
];

const CAP_STYLES = [
  { id: 'skinny', labelKey: 'capSkinny', shape: 'circle', radius: 12, mistRadius: 14, count: 22 },
  { id: 'medium', labelKey: 'capMedium', shape: 'circle', radius: 24, mistRadius: 24, count: 44 },
  { id: 'fat', labelKey: 'capFat', shape: 'circle', radius: 44, mistRadius: 40, count: 78 },
  {
    id: 'calligraphy',
    labelKey: 'capCalligraphy',
    shape: 'chisel',
    radius: 16,
    mistRadius: 14,
    count: 34,
    angle: -Math.PI / 5,
  },
  { id: 'needle', labelKey: 'capNeedle', shape: 'needle', radius: 5.5, mistRadius: 7, count: 16 },
  { id: 'splatter', labelKey: 'capSplatter', shape: 'splatter', radius: 54, mistRadius: 28, count: 46 },
];

const BACKGROUNDS = [
  { id: 'black', labelKey: 'bgBlack', type: 'solid', color: '#101116', gridColor: 'rgba(255, 255, 255, 0.04)' },
  { id: 'white', labelKey: 'bgWhite', type: 'solid', color: '#f5f5f0', gridColor: 'rgba(0, 0, 0, 0.045)' },
  { id: 'blank-wall', labelKey: 'bgBlankWall', type: 'image', src: blankWallImg },
  { id: 'grunge-wall', labelKey: 'bgGrungeWall', type: 'image', src: grungeWallImg },
  { id: 'brick-wall', labelKey: 'bgBrickWall', type: 'image', src: brickWallImg },
  { id: 'white-brick', labelKey: 'bgWhiteBrick', type: 'image', src: whiteBrickImg },
];

const MAX_HISTORY_STEPS = 15;

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 170, g: 23, b: 25 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function drawCoverImage(ctx, img, width, height) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imgRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imgRatio;
    offsetY = (height - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function paintSolidBackground(ctx, width, height, color, gridColor) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  if (!gridColor) return;
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  const step = 32;
  ctx.beginPath();
  for (let x = 0; x < width; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
}

function CapIcon({ shape, id, color }) {
  if (shape === 'chisel') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <rect
          x="2"
          y="7"
          width="14"
          height="4"
          rx="2"
          fill={color}
          transform="rotate(-35 9 9)"
        />
      </svg>
    );
  }
  if (shape === 'needle') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="2.2" fill={color} />
        <circle cx="9" cy="9" r="5.5" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (shape === 'splatter') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="3" fill={color} />
        <circle cx="4" cy="5" r="1.4" fill={color} />
        <circle cx="14" cy="6" r="1.7" fill={color} />
        <circle cx="5" cy="14" r="1.2" fill={color} />
        <circle cx="13.5" cy="13" r="1.5" fill={color} />
        <circle cx="9" cy="2.5" r="1" fill={color} />
      </svg>
    );
  }
  const size = id === 'skinny' ? 7 : id === 'medium' ? 12 : 17;
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  );
}

export default function SprayLab() {
  const { t, navigateWithTransition } = useApp();
  const canvasRef = useRef(null);
  const bgImgRef = useRef(null);
  const manifestoRef = useRef(null);

  const [activeColor, setActiveColor] = useState(SPRAY_COLORS[0]);
  const [customHex, setCustomHex] = useState('#ff6b00');
  const [activeCap, setActiveCap] = useState(CAP_STYLES[1]);
  const [activeBg, setActiveBg] = useState(BACKGROUNDS[0]);
  const [sprayFlow, setSprayFlow] = useState(100);
  const [chiselSize, setChiselSize] = useState(16);
  const [dripsEnabled, setDripsEnabled] = useState(true);
  const flowSliderId = useId();
  const chiselSliderId = useId();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderMsg, setSenderMsg] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState(null);

  const manifestoWords = useMemo(() => t.sprayLab.manifesto.split(' '), [t.sprayLab.manifesto]);
  const quoteWords = useMemo(() => `"${t.sprayLab.quote}"`.split(' '), [t.sprayLab.quote]);

  // Refs sincronizados para zero stale closure dentro do loop RAF
  const activeColorRef = useRef(activeColor);
  const activeCapRef = useRef(activeCap);
  const dripsEnabledRef = useRef(dripsEnabled);
  const sprayFlowRef = useRef(sprayFlow);
  const chiselSizeRef = useRef(chiselSize);

  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  useEffect(() => {
    activeCapRef.current = activeCap;
  }, [activeCap]);

  useEffect(() => {
    dripsEnabledRef.current = dripsEnabled;
  }, [dripsEnabled]);

  useEffect(() => {
    sprayFlowRef.current = sprayFlow;
  }, [sprayFlow]);

  useEffect(() => {
    chiselSizeRef.current = chiselSize;
  }, [chiselSize]);

  // Efeito scroll-scrubbed clareando as palavras do manifesto e da citação
  useEffect(() => {
    const container = manifestoRef.current;
    if (!container) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const words = container.querySelectorAll('.spraylab-reveal-word');
    if (prefersReducedMotion || words.length === 0) {
      words.forEach((w) => {
        w.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          duration: 0.08,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 60%',
            end: 'bottom 42%',
            scrub: 0.25,
          },
        }
      );
    }, manifestoRef);

    return () => ctx.revert();
  }, [manifestoWords, quoteWords]);

  // Estado imperativo do canvas (renderização direta em bitmap transparente sobre o fundo)
  const activeDripsRef = useRef([]);
  const isSprayingRef = useRef(false);
  const currentPosRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const holdFramesRef = useRef(0);
  const lastHoldSprayRef = useRef(0);
  const mistCounterRef = useRef(0);
  const rafRef = useRef(null);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const loopFnRef = useRef(null);

  const syncHistoryFlags = useCallback(() => {
    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(redoStackRef.current.length > 0);
  }, []);

  const pushSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStackRef.current.push(snap);
      if (undoStackRef.current.length > MAX_HISTORY_STEPS) {
        undoStackRef.current.shift();
      }
      redoStackRef.current = [];
      syncHistoryFlags();
    } catch {
      // ignore memory errors on constrained environments
    }
  }, [syncHistoryFlags]);

  const stampSprayAt = useCallback((x, y, intensity = 1, allowMist = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { r, g, b } = activeColorRef.current.rgb;
    const cap = activeCapRef.current;
    const flow = (sprayFlowRef.current / 100) * 1.35;
    const effectiveIntensity = intensity * flow;
    const activeChiselRadius = chiselSizeRef.current;

    // 1. Núcleo de névoa sutil (pulado no bico agulha para manter traço cirúrgico)
    mistCounterRef.current += 1;
    if (allowMist && cap.shape !== 'needle' && mistCounterRef.current % 2 === 0) {
      const baseMist = cap.shape === 'chisel' ? Math.max(8, activeChiselRadius * 0.85) : cap.mistRadius;
      const rad = baseMist * (0.85 + Math.random() * 0.35) * intensity;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${Math.min(0.14, 0.065 * effectiveIntensity)})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Micro-gotículas com geometria específica do bico (Cap)
    const baseCount =
      cap.shape === 'chisel'
        ? Math.max(16, Math.round(cap.count * (activeChiselRadius / 16)))
        : cap.count;
    const count = Math.max(2, Math.floor(baseCount * effectiveIntensity));
    for (let i = 0; i < count; i++) {
      let px = x;
      let py = y;
      let size;
      let alpha;

      if (cap.shape === 'chisel') {
        // Jato chanfrado plano inclinado (Calligraphy Cap)
        const along = (Math.random() * 2 - 1) * activeChiselRadius * intensity;
        const across = (Math.random() * 2 - 1) * Math.max(2.6, activeChiselRadius * 0.22) * intensity;
        const cosA = Math.cos(cap.angle);
        const sinA = Math.sin(cap.angle);
        px = x + along * cosA - across * sinA;
        py = y + along * sinA + across * cosA;
        size = Math.random() < 0.8 ? 0.75 + Math.random() * 1.25 : 1.6 + Math.random() * 1.5;
        alpha = 0.74 + Math.random() * 0.26;
      } else if (cap.shape === 'needle') {
        // Jato ultrafino concentrado (Needle Cap)
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 2.8) * (cap.radius * intensity);
        px = x + Math.cos(angle) * dist;
        py = y + Math.sin(angle) * dist;
        size = 0.55 + Math.random() * 0.95;
        alpha = 0.84 + Math.random() * 0.16;
      } else if (cap.shape === 'splatter') {
        // Respingo orgânico largo com gotas maiores (Astro / Splatter Cap)
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 1.35) * (cap.radius * intensity);
        px = x + Math.cos(angle) * dist;
        py = y + Math.sin(angle) * dist;
        size =
          Math.random() < 0.65
            ? 0.8 + Math.random() * 1.6
            : 2.2 + Math.random() * 3.1;
        alpha = 0.65 + Math.random() * 0.35;
      } else {
        // Bicos circulares clássicos (Skinny, Médio, Fat)
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 2.2) * (cap.radius * intensity);
        px = x + Math.cos(angle) * dist;
        py = y + Math.sin(angle) * dist;
        size =
          Math.random() < 0.86 ? 0.65 + Math.random() * 1.35 : 1.7 + Math.random() * 2.1;
        alpha = 0.68 + Math.random() * 0.32;
      }

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Tinta fresca escorrendo quando segura o jato ou em áreas densas
    if (dripsEnabledRef.current && cap.shape !== 'needle') {
      const shouldDrip =
        (holdFramesRef.current >= 5 && Math.random() < 0.45 * Math.min(1.5, flow)) ||
        Math.random() < 0.03 * effectiveIntensity;

      if (shouldDrip) {
        activeDripsRef.current.push({
          x: x + (Math.random() - 0.5) * (cap.radius * 0.55),
          y: y + Math.random() * 6,
          prevLength: 0,
          length: 0,
          maxLength: 24 + Math.random() * 80,
          speed: 1.4 + Math.random() * 2.4,
          width: 1.5 + Math.random() * 1.9,
          color: { r, g, b },
        });
        if (activeDripsRef.current.length > 40) {
          activeDripsRef.current.shift();
        }
      }
    }
  }, []);

  const runLoop = useCallback(
    (now) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      let needsMoreFrames = false;

      if (isSprayingRef.current) {
        needsMoreFrames = true;
        if (now - lastHoldSprayRef.current >= 28) {
          lastHoldSprayRef.current = now;
          holdFramesRef.current += 1;
          stampSprayAt(
            currentPosRef.current.x,
            currentPosRef.current.y,
            0.78,
            holdFramesRef.current % 2 === 0
          );
        }
      }

      const drips = activeDripsRef.current;
      if (ctx && drips.length > 0) {
        for (let i = drips.length - 1; i >= 0; i--) {
          const d = drips[i];
          const nextLength = Math.min(d.maxLength, d.length + d.speed);
          const { r, g, b } = d.color;

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.88)`;
          ctx.lineWidth = d.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(d.x, d.y + d.prevLength);
          ctx.lineTo(d.x, d.y + nextLength);
          ctx.stroke();

          d.prevLength = d.length;
          d.length = nextLength;

          if (d.length >= d.maxLength) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.94)`;
            ctx.beginPath();
            ctx.arc(d.x, d.y + d.length, d.width * 1.25, 0, Math.PI * 2);
            ctx.fill();
            drips.splice(i, 1);
          } else {
            needsMoreFrames = true;
          }
        }
      }

      if (needsMoreFrames) {
        rafRef.current = requestAnimationFrame((ts) => loopFnRef.current?.(ts));
      } else {
        rafRef.current = null;
      }
    },
    [stampSprayAt]
  );

  useEffect(() => {
    loopFnRef.current = runLoop;
  }, [runLoop]);

  const ensureLoop = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame((ts) => loopFnRef.current?.(ts));
    }
  }, []);

  // Inicializa e redimensiona preservando o desenho transparente existente
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const targetWidth = parent.clientWidth;
      const targetHeight = Math.max(500, window.innerHeight - 230);

      if (canvas.width === targetWidth && canvas.height === targetHeight) return;

      let preserved = null;
      if (canvas.width > 0 && canvas.height > 0) {
        preserved = document.createElement('canvas');
        preserved.width = canvas.width;
        preserved.height = canvas.height;
        const pCtx = preserved.getContext('2d');
        pCtx?.drawImage(canvas, 0, 0);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (preserved) {
        ctx.drawImage(preserved, 0, 0);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleUndo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx || undoStackRef.current.length === 0) return;

    activeDripsRef.current = [];
    try {
      const currentSnap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      redoStackRef.current.push(currentSnap);
      if (redoStackRef.current.length > MAX_HISTORY_STEPS) {
        redoStackRef.current.shift();
      }
    } catch {
      // ignore
    }

    const prevSnap = undoStackRef.current.pop();
    if (prevSnap) {
      ctx.putImageData(prevSnap, 0, 0);
    }
    syncHistoryFlags();
  }, [syncHistoryFlags]);

  const handleRedo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx || redoStackRef.current.length === 0) return;

    activeDripsRef.current = [];
    try {
      const currentSnap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStackRef.current.push(currentSnap);
      if (undoStackRef.current.length > MAX_HISTORY_STEPS) {
        undoStackRef.current.shift();
      }
    } catch {
      // ignore
    }

    const nextSnap = redoStackRef.current.pop();
    if (nextSnap) {
      ctx.putImageData(nextSnap, 0, 0);
    }
    syncHistoryFlags();
  }, [syncHistoryFlags]);

  // Atalhos de teclado Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (!(e.ctrlKey || e.metaKey)) return;

      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, handleRedo]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pushSnapshot();

    isSprayingRef.current = true;
    holdFramesRef.current = 0;
    lastHoldSprayRef.current = performance.now();

    const pos = getCanvasCoords(e);
    currentPosRef.current = pos;
    lastPosRef.current = pos;

    stampSprayAt(pos.x, pos.y, 1.15, true);
    ensureLoop();
  };

  const handlePointerMove = (e) => {
    if (!isSprayingRef.current) return;
    const current = getCanvasCoords(e);
    currentPosRef.current = current;

    const dx = current.x - lastPosRef.current.x;
    const dy = current.y - lastPosRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist >= 4) {
      if (dist > 14) holdFramesRef.current = 0;
      const steps = Math.max(1, Math.floor(dist / 7));
      for (let s = 1; s <= steps; s++) {
        const tStep = s / steps;
        stampSprayAt(
          lastPosRef.current.x + dx * tStep,
          lastPosRef.current.y + dy * tStep,
          0.9,
          s === steps
        );
      }
      lastPosRef.current = current;
      ensureLoop();
    }
  };

  const handlePointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isSprayingRef.current = false;
    holdFramesRef.current = 0;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    pushSnapshot();
    activeDripsRef.current = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleCustomColorChange = (e) => {
    const hex = e.target.value;
    setCustomHex(hex);
    setActiveColor({
      id: 'custom',
      name: `${t.sprayLab.customColorLabel} (${hex.toUpperCase()})`,
      hex,
      rgb: hexToRgb(hex),
    });
  };

  // Compõe fundo selecionado + camada de tinta em um canvas offscreen para exportação/envio
  const createCompositeCanvas = () => {
    const drawingCanvas = canvasRef.current;
    if (!drawingCanvas) return null;

    const out = document.createElement('canvas');
    out.width = drawingCanvas.width;
    out.height = drawingCanvas.height;
    const ctx = out.getContext('2d');
    if (!ctx) return null;

    if (activeBg.type === 'image' && bgImgRef.current && bgImgRef.current.complete) {
      drawCoverImage(ctx, bgImgRef.current, out.width, out.height);
    } else {
      paintSolidBackground(
        ctx,
        out.width,
        out.height,
        activeBg.color || '#101116',
        activeBg.gridColor
      );
    }

    ctx.drawImage(drawingCanvas, 0, 0);
    return out;
  };

  const handleExportPng = () => {
    const composite = createCompositeCanvas();
    if (!composite) return;
    const link = document.createElement('a');
    link.download = `grafitti-vinicius-lima-${Date.now()}.png`;
    link.href = composite.toDataURL('image/png');
    link.click();
  };

  const handleOpenEmailModal = () => {
    const composite = createCompositeCanvas();
    if (composite) {
      setPreviewDataUrl(composite.toDataURL('image/png'));
    }
    setIsModalOpen(true);
  };

  const handleCopyImage = async () => {
    const composite = createCompositeCanvas();
    if (!composite) return;
    try {
      composite.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new window.ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2000);
      });
    } catch {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(
      `[Spray Lab] Grafite de ${senderName.trim() || 'Visitante do Portfólio'}`
    );
    const body = encodeURIComponent(
      `Olá Vinicius!\n\nAcabei de desenhar no Spray Lab do seu portfólio.\n\nNome/Tag: ${
        senderName || 'Anônimo'
      }\nMensagem: ${senderMsg || 'Parabéns pelo portfólio!'}\n\n(Estou anexando a imagem exportada em anexo nesta conversa!)`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const scrollToStudio = () => {
    const el = document.getElementById('spraylab-studio');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className="detail-page container" style={{ maxWidth: '1160px', paddingBottom: '3.5rem' }}>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            navigateWithTransition('/');
          }}
          className="btn-secondary"
        >
          <ArrowLeft size={16} />
          <span>{t.projectDetail.backHome}</span>
        </Link>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <button type="button" onClick={handleExportPng} className="btn-secondary" title={t.sprayLab.exportBtn}>
            <Download size={16} />
            <span>{t.sprayLab.exportBtn}</span>
          </button>

          <button type="button" onClick={handleOpenEmailModal} className="btn-primary">
            <Mail size={16} />
            <span>{t.sprayLab.emailBtn}</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--accent)',
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={15} />
          <span>STUDIO URBANO • STREET CULTURE</span>
        </div>

        <h1 className="section-heading" style={{ marginBottom: '0.5rem' }}>
          {t.sprayLab.title}
        </h1>

        <p className="section-subtitle" style={{ maxWidth: '700px', marginBottom: '1.25rem' }}>
          {t.sprayLab.subtitle}
        </p>

        <button type="button" onClick={scrollToStudio} className="btn-secondary" style={{ margin: '0 auto' }}>
          <span>{t.sprayLab.jumpToCanvas}</span>
          <ArrowDown size={15} />
        </button>
      </header>

      {/* Manifesto & Citação Banksy com Scroll Word-Reveal */}
      <section ref={manifestoRef} className="spraylab-manifesto-section" aria-label="Manifesto Arte de Rua">
        <p className="spraylab-manifesto-text">
          {manifestoWords.map((word, idx) => (
            <span key={idx} className="spraylab-reveal-word">
              {word}{' '}
            </span>
          ))}
        </p>

        <blockquote className="spraylab-quote-box">
          <p className="spraylab-quote-text">
            {quoteWords.map((word, idx) => (
              <span key={idx} className="spraylab-reveal-word">
                {word}{' '}
              </span>
            ))}
          </p>
          <footer className="spraylab-quote-author">— {t.sprayLab.quoteAuthor}</footer>
        </blockquote>
      </section>

      {/* Studio Section Anchor */}
      <section id="spraylab-studio" style={{ scrollMarginTop: '24px' }}>
        {/* Toolbar Controls Dock */}
        <div className="spraylab-dock">
          {/* Colors + Custom Color Picker */}
          <div className="spraylab-dock-group">
            <span className="spraylab-dock-label">{t.sprayLab.colorsLabel}</span>
            <div className="spraylab-color-strip">
              {SPRAY_COLORS.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  className={`spraylab-color-swatch ${activeColor.id === col.id ? 'is-active' : ''}`}
                  style={{ backgroundColor: col.hex }}
                  onClick={() => setActiveColor(col)}
                  title={col.name}
                  aria-label={col.name}
                />
              ))}

              <label
                className={`spraylab-custom-color ${activeColor.id === 'custom' ? 'is-active' : ''}`}
                title={t.sprayLab.customColorLabel}
              >
                <input
                  type="color"
                  value={customHex}
                  onChange={handleCustomColorChange}
                  aria-label={t.sprayLab.customColorLabel}
                />
                <span
                  className="spraylab-custom-color-preview"
                  style={{
                    background:
                      activeColor.id === 'custom'
                        ? customHex
                        : 'conic-gradient(#ff007f, #ffd700, #10b981, #00e5ff, #0066ff, #aa1719, #ff007f)',
                  }}
                >
                  <Palette size={13} />
                </span>
                <span className="spraylab-custom-color-hex">
                  {activeColor.id === 'custom' ? customHex.toUpperCase() : t.sprayLab.customColorLabel}
                </span>
              </label>
            </div>
          </div>

          {/* Cap Styles */}
          <div className="spraylab-dock-group">
            <span className="spraylab-dock-label">{t.sprayLab.capLabel}</span>
            <div className="spraylab-caps-strip">
              {CAP_STYLES.map((cap) => (
                <button
                  key={cap.id}
                  type="button"
                  className={`spraylab-cap-btn ${activeCap.id === cap.id ? 'is-active' : ''}`}
                  onClick={() => setActiveCap(cap)}
                >
                  <CapIcon shape={cap.shape} id={cap.id} color={activeColor.hex} />
                  <span>{t.sprayLab[cap.labelKey]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Backgrounds */}
          <div className="spraylab-dock-group">
            <span className="spraylab-dock-label">{t.sprayLab.bgLabel}</span>
            <div className="spraylab-bg-strip">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  className={`spraylab-bg-btn ${activeBg.id === bg.id ? 'is-active' : ''}`}
                  onClick={() => setActiveBg(bg)}
                  title={t.sprayLab[bg.labelKey]}
                  aria-label={t.sprayLab[bg.labelKey]}
                >
                  {bg.type === 'image' ? (
                    <img src={bg.src} alt={t.sprayLab[bg.labelKey]} className="spraylab-bg-thumb" />
                  ) : (
                    <span
                      className="spraylab-bg-thumb"
                      style={{ backgroundColor: bg.color }}
                    />
                  )}
                  <span className="spraylab-bg-name">{t.sprayLab[bg.labelKey]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flow Slider */}
          <div className="spraylab-dock-group">
            <label htmlFor={flowSliderId} className="spraylab-dock-label">
              {t.sprayLab.flowLabel}
            </label>
            <div className="spraylab-flow-control">
              <input
                id={flowSliderId}
                type="range"
                min={10}
                max={100}
                step={5}
                value={sprayFlow}
                aria-valuetext={`${sprayFlow}%`}
                onChange={(e) => setSprayFlow(Number(e.target.value))}
                className="spraylab-flow-slider"
                style={{ '--slider-progress': `${((sprayFlow - 10) / (100 - 10)) * 100}%` }}
              />
              <span className="spraylab-flow-value">{sprayFlow}%</span>
            </div>
          </div>

          {/* Chisel Size Slider (visível no bico Chanfrado) */}
          {activeCap.id === 'calligraphy' && (
            <div className="spraylab-dock-group">
              <label htmlFor={chiselSliderId} className="spraylab-dock-label">
                {t.sprayLab.chiselSizeLabel}
              </label>
              <div className="spraylab-flow-control">
                <input
                  id={chiselSliderId}
                  type="range"
                  min={8}
                  max={36}
                  step={2}
                  value={chiselSize}
                  aria-valuetext={`${chiselSize}px`}
                  onChange={(e) => setChiselSize(Number(e.target.value))}
                  className="spraylab-flow-slider"
                  style={{ '--slider-progress': `${((chiselSize - 8) / (36 - 8)) * 100}%` }}
                />
                <span className="spraylab-flow-value">{chiselSize}px</span>
              </div>
            </div>
          )}

          {/* Drip Switch */}
          <div className="spraylab-dock-group">
            <span className="spraylab-dock-label">{t.sprayLab.dripLabel}</span>
            <button
              type="button"
              className={`spraylab-drip-toggle ${dripsEnabled ? 'is-active' : ''}`}
              onClick={() => setDripsEnabled((prev) => !prev)}
              title="Alternar física de tinta escorrendo"
            >
              <Droplets size={16} />
              <span>{dripsEnabled ? t.sprayLab.dripOn : t.sprayLab.dripOff}</span>
            </button>
          </div>
        </div>

        {/* Barra de ações rápidas colada no Canvas (Desfazer, Refazer, Limpar Tela) */}
        <div className="spraylab-canvas-bar">
          <div className="spraylab-canvas-status">
            <span
              className="spraylab-status-dot"
              style={{ backgroundColor: activeColor.hex }}
            />
            <span>{activeColor.name}</span>
            <span className="spraylab-status-sep">•</span>
            <span>{t.sprayLab[activeCap.labelKey]}</span>
            <span className="spraylab-status-sep">•</span>
            <span>{t.sprayLab[activeBg.labelKey]}</span>
            <span className="spraylab-status-sep">•</span>
            <span>{sprayFlow}%</span>
          </div>

          <div className="spraylab-canvas-actions">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="spraylab-bar-btn"
              title={`${t.sprayLab.undoBtn} (Ctrl+Z)`}
            >
              <Undo2 size={15} />
              <span>{t.sprayLab.undoBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="spraylab-bar-btn"
              title={`${t.sprayLab.redoBtn} (Ctrl+Y)`}
            >
              <Redo2 size={15} />
              <span>{t.sprayLab.redoBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="spraylab-bar-btn is-danger"
              title={t.sprayLab.clearBtn}
            >
              <RotateCcw size={15} />
              <span>{t.sprayLab.clearBtn}</span>
            </button>
          </div>
        </div>

        {/* Main Drawing Canvas Board */}
        <div
          className="spraylab-canvas-container"
          style={
            activeBg.type === 'solid'
              ? {
                  backgroundColor: activeBg.color,
                  backgroundImage: `linear-gradient(${activeBg.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${activeBg.gridColor} 1px, transparent 1px)`,
                  backgroundSize: '32px 32px',
                }
              : undefined
          }
        >
          {activeBg.type === 'image' && (
            <img
              ref={bgImgRef}
              src={activeBg.src}
              alt={t.sprayLab[activeBg.labelKey]}
              className="spraylab-bg-layer-img"
              draggable={false}
            />
          )}

          <canvas
            ref={canvasRef}
            className="spraylab-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          <div className="spraylab-canvas-hint">
            <span>{t.sprayLab.hint}</span>
          </div>
        </div>
      </section>

      {/* Modal Enviar para o E-mail */}
      {isModalOpen && (
        <div className="spraylab-modal-backdrop" role="dialog" aria-modal="true">
          <div className="spraylab-modal-card">
            <div className="spraylab-modal-header">
              <h3>{t.sprayLab.emailModal.title}</h3>
              <button
                type="button"
                className="spraylab-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {t.sprayLab.emailModal.subtitle}
            </p>

            {previewDataUrl && (
              <div className="spraylab-preview-box">
                <img src={previewDataUrl} alt="Preview do seu grafite" />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {t.sprayLab.emailModal.yourName}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Ex: Pedro / Tag 'PHX'"
                  className="cvlab-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {t.sprayLab.emailModal.yourMessage}
                </label>
                <textarea
                  value={senderMsg}
                  onChange={(e) => setSenderMsg(e.target.value)}
                  placeholder="Deixe um recado sobre o desenho ou uma oportunidade..."
                  rows={2}
                  className="cvlab-textarea"
                />
              </div>
            </div>

            <div className="spraylab-modal-actions">
              <button type="button" onClick={handleCopyImage} className="btn-secondary">
                {copiedToast ? <Check size={16} style={{ color: '#22c55e' }} /> : <Copy size={16} />}
                <span>
                  {copiedToast ? t.sprayLab.emailModal.copiedToast : t.sprayLab.emailModal.copyImageBtn}
                </span>
              </button>

              <button type="button" onClick={handleExportPng} className="btn-secondary">
                <Download size={16} />
                <span>{t.sprayLab.emailModal.downloadAttachment}</span>
              </button>

              <button type="button" onClick={handleSendEmail} className="btn-primary">
                <ExternalLink size={16} />
                <span>{t.sprayLab.emailModal.openEmailBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
