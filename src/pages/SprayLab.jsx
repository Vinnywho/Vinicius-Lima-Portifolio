import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Mail,
  RotateCcw,
  Undo2,
  Sparkles,
  Droplets,
  Copy,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/profile';

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

const CAP_SIZES = [
  { id: 'skinny', label: 'Skinny Cap', radius: 13, mistRadius: 15, count: 24 },
  { id: 'medium', label: 'Médio', radius: 24, mistRadius: 24, count: 44 },
  { id: 'fat', label: 'Fat Cap', radius: 42, mistRadius: 38, count: 76 },
];

const MAX_UNDO_STEPS = 12;

function paintStudioBackground(ctx, width, height) {
  ctx.fillStyle = '#101116';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
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

export default function SprayLab() {
  const { t, navigateWithTransition } = useApp();
  const canvasRef = useRef(null);

  const [activeColor, setActiveColor] = useState(SPRAY_COLORS[0]);
  const [activeCap, setActiveCap] = useState(CAP_SIZES[1]);
  const [dripsEnabled, setDripsEnabled] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderMsg, setSenderMsg] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState(null);

  // Refs sincronizados para zero stale closure dentro do loop RAF
  const activeColorRef = useRef(activeColor);
  const activeCapRef = useRef(activeCap);
  const dripsEnabledRef = useRef(dripsEnabled);

  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  useEffect(() => {
    activeCapRef.current = activeCap;
  }, [activeCap]);

  useEffect(() => {
    dripsEnabledRef.current = dripsEnabled;
  }, [dripsEnabled]);

  // Estado imperativo do canvas (renderização direta em bitmap, O(1) por frame!)
  const activeDripsRef = useRef([]);
  const isSprayingRef = useRef(false);
  const currentPosRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const holdFramesRef = useRef(0);
  const lastHoldSprayRef = useRef(0);
  const mistCounterRef = useRef(0);
  const rafRef = useRef(null);
  const historyRef = useRef([]);
  const loopFnRef = useRef(null);

  const pushSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(snap);
      if (historyRef.current.length > MAX_UNDO_STEPS) {
        historyRef.current.shift();
      }
      setCanUndo(historyRef.current.length > 0);
    } catch {
      // ignore memory errors on constrained environments
    }
  }, []);

  const stampSprayAt = useCallback((x, y, intensity = 1, allowMist = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { r, g, b } = activeColorRef.current.rgb;
    const cap = activeCapRef.current;

    // 1. Núcleo de névoa sutil (sem sobreposição pesada / sem blur estranho)
    mistCounterRef.current += 1;
    if (allowMist && mistCounterRef.current % 2 === 0) {
      const rad = cap.mistRadius * (0.85 + Math.random() * 0.35) * intensity;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.065 * intensity})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Micro-gotículas densas estampadas diretamente no bitmap
    const count = Math.floor(cap.count * intensity);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 2.2) * (cap.radius * intensity);
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      const size =
        Math.random() < 0.86 ? 0.65 + Math.random() * 1.35 : 1.7 + Math.random() * 2.1;
      const alpha = 0.68 + Math.random() * 0.32;

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Tinta fresca escorrendo quando segura o jato ou em áreas densas
    if (dripsEnabledRef.current) {
      const shouldDrip =
        (holdFramesRef.current >= 5 && Math.random() < 0.45) ||
        Math.random() < 0.03 * intensity;

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

      // Emissão contínua ao segurar o botão (mesmo com cursor parado!)
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

      // Física incremental das gotas escorrendo (O(1) por frame, sem redesenhar a arte inteira!)
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
            // Poça final na ponta da gota
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

  // Inicializa e redimensiona preservando o desenho existente
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
      paintStudioBackground(ctx, targetWidth, targetHeight);

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

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx || historyRef.current.length === 0) return;

    activeDripsRef.current = [];
    const lastSnap = historyRef.current.pop();
    if (lastSnap) {
      ctx.putImageData(lastSnap, 0, 0);
    }
    setCanUndo(historyRef.current.length > 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    pushSnapshot();
    activeDripsRef.current = [];
    paintStudioBackground(ctx, canvas.width, canvas.height);
  };

  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `grafitti-vinicius-lima-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleOpenEmailModal = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setPreviewDataUrl(canvas.toDataURL('image/png'));
    }
    setIsModalOpen(true);
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
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

  return (
    <article className="detail-page container" style={{ maxWidth: '1160px', paddingBottom: '3rem' }}>
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
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="btn-secondary"
            style={!canUndo ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
            title={t.sprayLab.undoBtn}
          >
            <Undo2 size={16} />
            <span>{t.sprayLab.undoBtn}</span>
          </button>

          <button type="button" onClick={handleClear} className="btn-secondary" title={t.sprayLab.clearBtn}>
            <RotateCcw size={16} />
            <span>{t.sprayLab.clearBtn}</span>
          </button>

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
      <header style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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

        <p className="section-subtitle" style={{ maxWidth: '680px', marginBottom: '1.5rem' }}>
          {t.sprayLab.subtitle}
        </p>
      </header>

      {/* Toolbar Controls Dock */}
      <div className="spraylab-dock">
        {/* Colors */}
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
          </div>
        </div>

        {/* Cap Sizes */}
        <div className="spraylab-dock-group">
          <span className="spraylab-dock-label">{t.sprayLab.capLabel}</span>
          <div className="spraylab-caps-strip">
            {CAP_SIZES.map((cap) => (
              <button
                key={cap.id}
                type="button"
                className={`spraylab-cap-btn ${activeCap.id === cap.id ? 'is-active' : ''}`}
                onClick={() => setActiveCap(cap)}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: cap.id === 'skinny' ? 8 : cap.id === 'medium' ? 14 : 20,
                    height: cap.id === 'skinny' ? 8 : cap.id === 'medium' ? 14 : 20,
                    borderRadius: '50%',
                    backgroundColor: activeColor.hex,
                  }}
                />
                <span>{cap.label}</span>
              </button>
            ))}
          </div>
        </div>

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

      {/* Main Drawing Canvas Board */}
      <div className="spraylab-canvas-container">
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
