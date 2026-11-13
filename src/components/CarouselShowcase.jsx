import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Layers } from 'lucide-react';

/**
 * Exibição interativa de carrosséis (estilo Instagram/Behance) com swipe,
 * setas, miniaturas, contador de slides e abertura em tela cheia.
 */
export default function CarouselShowcase({
  heading,
  slides = [],
  caption,
  onExpand,
  tr,
  lang = 'pt',
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef(null);

  if (!slides.length) return null;

  const total = slides.length;
  const currentSlide = slides[activeIndex] || slides[0];

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartXRef.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const resolveText = (val) => (typeof tr === 'function' ? tr(val) : val || '');
  const slideCaption = resolveText(currentSlide.caption) || resolveText(caption);

  return (
    <section
      className="behance-carousel-block"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label={resolveText(heading) || (lang === 'pt' ? 'Carrossel de slides' : 'Slide carousel')}
    >
      <div className="behance-carousel-header">
        <div className="behance-carousel-title-wrap">
          <Layers size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <h2 className="behance-carousel-heading">
            {resolveText(heading) || (lang === 'pt' ? 'Carrossel' : 'Carousel')}
          </h2>
        </div>

        <div className="behance-carousel-meta">
          <span className="behance-carousel-counter">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <button
            type="button"
            className="behance-expand-btn"
            onClick={() =>
              onExpand?.({
                src: currentSlide.image,
                caption: slideCaption,
              })
            }
          >
            <ZoomIn size={14} />
            <span>{lang === 'pt' ? 'Tela cheia' : 'Expand'}</span>
          </button>
        </div>
      </div>

      <div
        className="behance-carousel-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="behance-carousel-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => {
            const altText =
              resolveText(slide.caption) ||
              `${resolveText(heading) || 'Slide'} ${idx + 1}`;
            return (
              <div key={idx} className="behance-carousel-slide">
                <button
                  type="button"
                  className="behance-carousel-zoom-btn"
                  onClick={() =>
                    onExpand?.({
                      src: slide.image,
                      caption: resolveText(slide.caption) || resolveText(caption),
                    })
                  }
                  aria-label={altText}
                >
                  <img src={slide.image} alt={altText} loading="lazy" />
                </button>
              </div>
            );
          })}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              className="behance-carousel-arrow is-prev"
              onClick={goPrev}
              aria-label={lang === 'pt' ? 'Slide anterior' : 'Previous slide'}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="behance-carousel-arrow is-next"
              onClick={goNext}
              aria-label={lang === 'pt' ? 'Próximo slide' : 'Next slide'}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="behance-carousel-thumbs" role="tablist" aria-label="Slides">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              className={`behance-carousel-thumb ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`${lang === 'pt' ? 'Ir para slide' : 'Go to slide'} ${idx + 1}`}
            >
              <img src={slide.image} alt="" aria-hidden="true" loading="lazy" />
              <span className="behance-carousel-thumb-num">{idx + 1}</span>
            </button>
          ))}
        </div>
      )}

      {slideCaption && <p className="behance-board-caption">{slideCaption}</p>}
    </section>
  );
}
