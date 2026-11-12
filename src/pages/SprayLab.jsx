import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Mail,
  RotateCcw,
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
  { id: 'skinny', label: 'Skinny Cap', radius: 14, mistRadius: 18, count: 20 },
  { id: 'medium', label: 'Médio', radius: 26, mistRadius: 30, count: 38 },
  { id: 'fat', label: 'Fat Cap', radius: 46, mistRadius: 52, count: 65 },
];

export default function SprayLab() {
  const { t, navigateWithTransition } = useApp();
  const canvasRef = useRef(null);

  const [activeColor, setActiveColor] = useState(SPRAY_COLORS[0]);
  const [activeCap, setActiveCap] = useState(CAP_SIZES[1]);
  const [dripsEnabled, setDripsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderMsg, setSenderMsg] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState(null);

  // Drawing state
  const mistsRef = useRef([]);
  const particlesRef = useRef([]);
  const dripsRef = useRef([]);
  const isSprayingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const stationaryRef = useRef(0);
  const rafRef = useRef(null);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fundo de parede urbana com gradiente sutil
    ctx.fillStyle = '#101116';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid sutil de estúdio
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const step = 32;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 1. Névoas suaves
    const mists = mistsRef.current;
    for (let i = 0; i < mists.length; i++) {
      const m = mists[i];
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
      grad.addColorStop(0, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${m.alpha})`);
      grad.addColorStop(0.5, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${m.alpha * 0.45})`);
      grad.addColorStop(1, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Gotas escorrendo (Drips)
    const drips = dripsRef.current;
    for (let i = 0; i < drips.length; i++) {
      const d = drips[i];
      ctx.strokeStyle = `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${d.alpha})`;
      ctx.lineWidth = d.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.length);
      ctx.stroke();

      ctx.fillStyle = `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${d.alpha})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y + d.length, d.width * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Micro-gotículas
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const loopRef = useRef(null);

  const updateDripsLoop = useCallback(() => {
    let hasGrowing = false;
    const drips = dripsRef.current;

    for (let i = 0; i < drips.length; i++) {
      const d = drips[i];
      if (d.length < d.maxLength) {
        d.length = Math.min(d.maxLength, d.length + d.speed);
        hasGrowing = true;
      }
    }

    redrawCanvas();

    if (hasGrowing) {
      rafRef.current = requestAnimationFrame(() => loopRef.current?.());
    } else {
      rafRef.current = null;
    }
  }, [redrawCanvas]);

  useEffect(() => {
    loopRef.current = updateDripsLoop;
  }, [updateDripsLoop]);

  const triggerDripAnim = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => loopRef.current?.());
    }
  }, []);

  // Redimensiona o canvas para caber na tela
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = Math.max(520, window.innerHeight - 220);
      redrawCanvas();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [redrawCanvas]);

  const sprayAtPoint = (x, y, intensity = 1) => {
    const color = activeColor.rgb;
    const cap = activeCap;

    // Névoa
    mistsRef.current.push({
      x,
      y,
      radius: cap.mistRadius * (0.8 + Math.random() * 0.4) * intensity,
      color,
      alpha: 0.22 * intensity,
    });

    // Partículas
    const count = Math.floor(cap.count * intensity);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 2.1) * (cap.radius * intensity);
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;

      particlesRef.current.push({
        x: px,
        y: py,
        size: Math.random() < 0.85 ? 0.7 + Math.random() * 1.4 : 1.8 + Math.random() * 2.4,
        color,
        alpha: 0.78 + Math.random() * 0.22,
      });
    }

    // Drips ao segurar no mesmo ponto
    if (dripsEnabled && stationaryRef.current > 8 && Math.random() < 0.35) {
      dripsRef.current.push({
        x: x + (Math.random() - 0.5) * (cap.radius * 0.5),
        y: y + Math.random() * 8,
        length: 0,
        maxLength: 25 + Math.random() * 75,
        speed: 1.5 + Math.random() * 2.4,
        width: 1.6 + Math.random() * 1.8,
        color,
        alpha: 0.92,
      });
      triggerDripAnim();
    }

    // Proteção de limites
    if (mistsRef.current.length > 500) mistsRef.current.splice(0, mistsRef.current.length - 500);
    if (particlesRef.current.length > 3500)
      particlesRef.current.splice(0, particlesRef.current.length - 3500);
    if (dripsRef.current.length > 120) dripsRef.current.splice(0, dripsRef.current.length - 120);

    redrawCanvas();
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isSprayingRef.current = true;
    stationaryRef.current = 0;
    const pos = getCanvasCoords(e);
    lastPosRef.current = pos;
    sprayAtPoint(pos.x, pos.y, 1.2);
  };

  const handlePointerMove = (e) => {
    if (!isSprayingRef.current) return;
    const current = getCanvasCoords(e);
    const dist = Math.hypot(current.x - lastPosRef.current.x, current.y - lastPosRef.current.y);

    if (dist < 4) {
      stationaryRef.current += 1;
      sprayAtPoint(current.x, current.y, 0.45);
    } else {
      stationaryRef.current = 0;
      // Interpolação para linha contínua
      const steps = Math.max(1, Math.floor(dist / 8));
      for (let s = 1; s <= steps; s++) {
        const tStep = s / steps;
        sprayAtPoint(
          lastPosRef.current.x + (current.x - lastPosRef.current.x) * tStep,
          lastPosRef.current.y + (current.y - lastPosRef.current.y) * tStep,
          0.85
        );
      }
      lastPosRef.current = current;
    }
  };

  const handlePointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isSprayingRef.current = false;
    stationaryRef.current = 0;
  };

  const handleClear = () => {
    mistsRef.current = [];
    particlesRef.current = [];
    dripsRef.current = [];
    redrawCanvas();
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
      // Fallback
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
