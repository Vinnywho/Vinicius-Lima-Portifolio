import { ZoomIn, ExternalLink } from 'lucide-react';

/**
 * Moldura estilo navegador com barra de título, scroll interno (imagem ou PDF) e botão de tela cheia.
 */
export default function ScrollFrame({
  image,
  pdf,
  title,
  caption,
  onExpand,
  lang = 'pt',
}) {
  const defaultTitle =
    lang === 'pt' ? 'Role a página para explorar' : 'Scroll inside to explore';

  return (
    <figure className="behance-scroll-block">
      <div className="behance-browser-bar">
        <div className="behance-browser-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="behance-browser-title">{title || defaultTitle}</span>
        <div className="behance-browser-actions">
          {pdf && (
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="behance-expand-btn"
              title={lang === 'pt' ? 'Abrir PDF em nova aba' : 'Open PDF in new tab'}
            >
              <ExternalLink size={14} />
              <span>PDF</span>
            </a>
          )}
          <button
            type="button"
            className="behance-expand-btn"
            onClick={() =>
              onExpand?.({ src: image, pdf, caption: caption || title || '' })
            }
          >
            <ZoomIn size={14} />
            <span>{lang === 'pt' ? 'Tela cheia' : 'Expand'}</span>
          </button>
        </div>
      </div>
      <div className={`behance-scroll-viewport ${pdf ? 'is-pdf' : ''}`}>
        {pdf ? (
          <iframe
            className="behance-pdf-frame"
            src={`${pdf}#toolbar=0&navpanes=0&view=FitH`}
            title={caption || title || 'PDF'}
          />
        ) : (
          <img src={image} alt={caption || title || ''} loading="lazy" />
        )}
      </div>
      {caption && <figcaption className="behance-board-caption">{caption}</figcaption>}
    </figure>
  );
}
