import { useId, useRef, useState } from 'react';
import { MessageCircle, Send, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/profile';

export default function ContactWhatsApp() {
  const { t, lang } = useApp();
  const baseId = useId();
  const nameRef = useRef(null);
  const messageRef = useRef(null);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const subjects = t.contact.subjects;
  const activeSubject = subject || subjects[0];

  const validateField = (field, val) => {
    if (field === 'name' && !val.trim()) return t.contact.errorName;
    if (field === 'message' && !val.trim()) return t.contact.errorMessage;
    return '';
  };

  const handleBlur = (field, value) => {
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameErr = validateField('name', name);
    const msgErr = validateField('message', message);

    if (nameErr || msgErr) {
      setErrors({ name: nameErr, message: msgErr });
      if (nameErr) nameRef.current?.focus();
      else if (msgErr) messageRef.current?.focus();
      return;
    }
    
    const msg = 
      lang === 'pt'
        ? `Olá Vinicius! Meu nome é *${name.trim()}*. Vim através do seu portfólio para falar sobre *${activeSubject}*.\n${message.trim()}`
        : `Hi Vinicius! My name is *${name.trim()}*. I came across your portfolio to discuss *${activeSubject}*.\n${message.trim()}`;

    const fullText = encodeURIComponent(`${msg}`);
    const url = `https://wa.me/${profile.whatsappNumber}?text=${fullText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contato" className="contact-section container no-print" aria-labelledby={`${baseId}-heading`}>
      <div className="contact-card">
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--accent)',
              letterSpacing: '0.1em',
            }}
          >
            {t.contact.eyebrow}
          </span>
          <h2
            id={`${baseId}-heading`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
              color: 'var(--accent)',
              letterSpacing: '0.06em',
              lineHeight: 1.08,
              margin: '0.45rem 0 1rem',
            }}
          >
            {t.contact.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem' }}>
            {t.contact.subtitle}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                background: 'var(--bg-surface-alt)',
                border: '1.5px solid var(--border-color)',
                fontSize: '0.88rem',
                fontWeight: 700,
              }}
            >
              <MessageCircle size={18} style={{ color: '#25D366', flexShrink: 0 }} />
              <span>WhatsApp: {profile.phoneDisplay}</span>
            </div>

            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                background: 'var(--bg-surface-alt)',
                border: '1.5px solid var(--border-color)',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={{ color: '#0A66C2', flexShrink: 0 }}
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>LinkedIn</span>
              <ExternalLink size={14} style={{ opacity: 0.65, flexShrink: 0 }} />
            </a>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
            {t.contact.directEmail}{' '}
            <a
              href={`mailto:${profile.email}`}
              style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'underline' }}
            >
              {profile.email}
            </a>
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate aria-labelledby={`${baseId}-heading`}>
          <div className="form-field">
            <label htmlFor={`${baseId}-name`}>
              {t.contact.nameLabel} <span aria-hidden="true">*</span>
            </label>
            <input
              ref={nameRef}
              id={`${baseId}-name`}
              name="name"
              type="text"
              className="form-control"
              autoComplete="name"
              placeholder={t.contact.namePlaceholder}
              value={name}
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${baseId}-name-err` : undefined}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              onBlur={(e) => handleBlur('name', e.target.value)}
            />
            {errors.name && (
              <span id={`${baseId}-name-err`} className="form-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor={`${baseId}-subject`}>{t.contact.subjectLabel}</label>
            <select
              id={`${baseId}-subject`}
              name="subject"
              className="form-control"
              value={activeSubject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {subjects.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor={`${baseId}-msg`}>
              {t.contact.messageLabel} <span aria-hidden="true">*</span>
            </label>
            <textarea
              ref={messageRef}
              id={`${baseId}-msg`}
              name="message"
              rows={4}
              className="form-control"
              placeholder={t.contact.messagePlaceholder}
              value={message}
              aria-required="true"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${baseId}-msg-err` : undefined}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
              }}
              onBlur={(e) => handleBlur('message', e.target.value)}
            />
            {errors.message && (
              <span id={`${baseId}-msg-err`} className="form-error" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Send size={18} />
            <span>{t.contact.submitBtn}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
