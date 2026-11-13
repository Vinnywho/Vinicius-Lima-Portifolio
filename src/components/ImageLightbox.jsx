import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

export default function ImageLightbox({ image, onClose, lang = 'pt' }) {
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  const isClosingRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tallScrollSrc, setTallScrollSrc] = useState(null);
  const isTallScroll = Boolean(image?.src && tallScrollSrc === image.src);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;

    if (prefersReducedMotion || !backdrop || !dialog) {
      onClose();
      return;
    }

    gsap.killTweensOf([backdrop, dialog]);

    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
      },
    });

    tl.to(dialog, {
      scale: 0.94,
      y: 14,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
    }).to(
      backdrop,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.14'
    );
  }, [onClose]);

  useEffect(() => {
    if (!image) return;
    isClosingRef.current = false;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;

    if (!prefersReducedMotion && backdrop && dialog) {
      gsap.killTweensOf([backdrop, dialog]);
      gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: 'power2.out' }
      );
      gsap.fromTo(
        dialog,
        { scale: 0.92, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.36, ease: 'power3.out' }
      );
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [image, handleClose]);

  if (!image) return null;

  return (
    <div
      ref={backdropRef}
      className={`behance-lightbox-backdrop ${isFullscreen ? 'is-fullscreen' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        className={`behance-lightbox-dialog ${isFullscreen ? 'is-fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="behance-lightbox-toolbar">
          {image.pdf && (
            <a
              href={image.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="behance-lightbox-icon-btn"
              aria-label={lang === 'pt' ? 'Abrir PDF em nova aba' : 'Open PDF in new tab'}
              title={lang === 'pt' ? 'Abrir PDF em nova aba' : 'Open PDF in new tab'}
            >
              <ExternalLink size={18} />
            </a>
          )}

          <button
            type="button"
            className="behance-lightbox-icon-btn"
            onClick={() => setIsFullscreen((prev) => !prev)}
            aria-label={
              isFullscreen
                ? lang === 'pt'
                  ? 'Sair da tela cheia'
                  : 'Exit fullscreen'
                : lang === 'pt'
                  ? 'Expandir para tela cheia'
                  : 'Expand to fullscreen'
            }
            title={
              isFullscreen
                ? lang === 'pt'
                  ? 'Reduzir'
                  : 'Restore'
                : lang === 'pt'
                  ? 'Tela cheia'
                  : 'Fullscreen'
            }
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          <button
            type="button"
            className="behance-lightbox-icon-btn"
            onClick={handleClose}
            aria-label={lang === 'pt' ? 'Fechar visualização' : 'Close preview'}
            title={lang === 'pt' ? 'Fechar (Esc)' : 'Close (Esc)'}
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`behance-lightbox-scroll ${image.pdf ? 'is-pdf' : ''} ${
            isTallScroll ? 'is-tall-scroll' : ''
          }`}
        >
          {image.pdf ? (
            <iframe
              className="behance-lightbox-pdf"
              src={`${image.pdf}#view=FitH`}
              title={image.caption || 'PDF'}
            />
          ) : (
            <img
              src={image.src}
              alt={image.caption || ''}
              onLoad={(e) => {
                const { naturalWidth, naturalHeight } = e.currentTarget;
                setTallScrollSrc(
                  naturalWidth > 0 && naturalHeight / naturalWidth > 2.6
                    ? image.src
                    : null
                );
              }}
            />
          )}
        </div>

        {image.caption && <p className="behance-lightbox-caption">{image.caption}</p>}
      </div>
    </div>
  );
}
