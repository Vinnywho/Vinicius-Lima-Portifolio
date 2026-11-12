import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Search, X, HelpCircle, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { faqItems } from '../data/faqData';
import { profile } from '../data/profile';

export default function FAQ() {
  const { t, tr, navigateWithTransition } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(() => new Set(['hire-model', 'stack-preference']));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleItem = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = [
    { key: 'all', label: t.faq.categories.all },
    { key: 'general', label: t.faq.categories.general },
    { key: 'frontend', label: t.faq.categories.frontend },
    { key: 'design', label: t.faq.categories.design },
    { key: 'process', label: t.faq.categories.process },
  ];

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const questionText = tr(item.question).toLowerCase();
      const answerText = tr(item.answer).toLowerCase();
      return questionText.includes(q) || answerText.includes(q);
    });
  }, [selectedCategory, searchQuery, tr]);

  return (
    <article className="detail-page container" style={{ maxWidth: '960px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
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
      </div>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--accent)',
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '1rem',
          }}
        >
          <HelpCircle size={15} />
          <span>FAQ • DÚVIDAS FREQUENTES</span>
        </div>

        <h1 className="section-heading" style={{ marginBottom: '0.75rem' }}>
          {t.faq.title}
        </h1>

        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
          {t.faq.subtitle}
        </p>

        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            maxWidth: '640px',
            marginInline: 'auto',
            marginBottom: '1.75rem',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1.1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.faq.searchPlaceholder}
            className="faq-search-input"
            aria-label={t.faq.searchPlaceholder}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`timeline-filter-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Accordion Questions List */}
      <section className="faq-list-wrapper">
        {filteredItems.length === 0 ? (
          <div
            className="detail-box"
            style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-secondary)' }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{t.faq.noResults}</p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOpen = openIds.has(item.id);

            return (
              <div key={item.id} className="faq-card">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="faq-question-btn"
                >
                  <span className="faq-question-text">{tr(item.question)}</span>
                  <span
                    className={`timeline-chevron ${isOpen ? 'is-open' : ''}`}
                    aria-hidden="true"
                    style={{ flexShrink: 0 }}
                  >
                    <ChevronDown size={20} />
                  </span>
                </button>

                <div
                  className={`timeline-expand-wrapper ${isOpen ? 'is-open' : ''}`}
                  aria-hidden={!isOpen}
                >
                  <div className="timeline-expand-inner">
                    <div className="faq-answer-body">
                      <p>{tr(item.answer)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Direct Contact Banner */}
      <div
        className="detail-box"
        style={{
          marginTop: '3.5rem',
          textAlign: 'center',
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--accent)',
          padding: '2.5rem 1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
          {t.contact.eyebrow}
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            marginInline: 'auto',
            marginBottom: '1.5rem',
          }}
        >
          {t.faq.contactCta}
        </p>
        <a
          href={profile.contacts.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          <MessageCircle size={18} />
          <span>{t.contact.submitBtn}</span>
        </a>
      </div>
    </article>
  );
}
