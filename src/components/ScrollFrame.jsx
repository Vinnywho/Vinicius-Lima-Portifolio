import { ZoomIn } from 'lucide-react';

/**
 * Moldura estilo navegador com barra de título, scroll interno e botão de tela cheia.
 */
export default function ScrollFrame({
  image,
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
        <button
          type="button"
          className="behance-expand-btn"
          onClick={() => onExpand?.({ src: image, caption: caption || title || '' })}
        >
          <ZoomIn size={14} />
          <span>{lang === 'pt' ? 'Tela cheia' : 'Expand'}</span>
        </button>
      </div>
      <div className="behance-scroll-viewport">
        <img src={image} alt={caption || title || ''} loading="lazy" />
      </div>
      {caption && <figcaption className="behance-board-caption">{caption}</figcaption>}
    </figure>
  );
}
