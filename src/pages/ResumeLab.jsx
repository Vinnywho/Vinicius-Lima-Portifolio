import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, RotateCcw, Code2, Palette, CheckSquare, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/profile';
import { experiences } from '../data/experiences';
import { projects } from '../data/projects';
import { skills, designCapabilities } from '../data/skills';

const STORAGE_KEY = 'vinicius-cv-lab-draft-v1';

function buildPreset(presetType, cvLang) {
  const allEdu = profile.education.map((e) => e.id);
  const allSoft = profile.softSkills.map((s) => s.id);

  if (presetType === 'dev') {
    return {
      cvLang,
      layoutStyle: 'classic',
      targetRole: cvLang === 'pt' ? 'DESENVOLVEDOR FRONT-END' : 'FRONT-END DEVELOPER',
      summary: profile.cvSummaries.dev[cvLang],
      selectedEducation: allEdu.slice(0, 2),
      selectedExperiences: experiences
        .filter((e) => e.category === 'tech' || e.category === 'career')
        .map((e) => e.id),
      selectedProjects: projects
        .filter((p) => p.category === 'dev' || p.category === 'both')
        .slice(0, 4)
        .map((p) => p.id),
      selectedDevSkills: skills.map((s) => s.id),
      selectedDesignSkills: ['ui-ux-design'],
      selectedSoftSkills: allSoft,
    };
  }

  if (presetType === 'design') {
    return {
      cvLang,
      layoutStyle: 'editorial',
      targetRole: cvLang === 'pt' ? 'DESIGNER UI/UX & GRÁFICO' : 'UI/UX & GRAPHIC DESIGNER',
      summary: profile.cvSummaries.design[cvLang],
      selectedEducation: allEdu.slice(0, 2),
      selectedExperiences: experiences
        .filter((e) => e.category === 'design' || e.category === 'career')
        .map((e) => e.id),
      selectedProjects: projects
        .filter((p) => p.category === 'design' || p.category === 'both')
        .map((p) => p.id),
      selectedDevSkills: ['figma', 'html', 'css', 'react'],
      selectedDesignSkills: designCapabilities.map((d) => d.id),
      selectedSoftSkills: allSoft,
    };
  }

  // 'full'
  return {
    cvLang,
    layoutStyle: 'editorial',
    targetRole:
      cvLang === 'pt'
        ? 'DESENVOLVEDOR FRONT-END & DESIGNER UI/UX'
        : 'FRONT-END DEVELOPER & UI/UX DESIGNER',
    summary: profile.cvSummaries.hybrid[cvLang],
    selectedEducation: allEdu,
    selectedExperiences: experiences.map((e) => e.id),
    selectedProjects: projects.map((p) => p.id),
    selectedDevSkills: skills.map((s) => s.id),
    selectedDesignSkills: designCapabilities.map((d) => d.id),
    selectedSoftSkills: allSoft,
  };
}

export default function ResumeLab() {
  const { lang, t, tr } = useApp();

  const [draft, setDraft] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return buildPreset('dev', lang);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [draft]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleItem = (field, id) => {
    setDraft((prev) => {
      const exists = prev[field].includes(id);
      return {
        ...prev,
        [field]: exists ? prev[field].filter((x) => x !== id) : [...prev[field], id],
      };
    });
  };

  const applyPreset = (type) => {
    setDraft(buildPreset(type, draft.cvLang));
  };

  const handleCvLangChange = (nextLang) => {
    setDraft((prev) => ({
      ...prev,
      cvLang: nextLang,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const cvT = draft.cvLang === 'en' ? 'en' : 'pt';
  const resText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[cvT] ?? obj.pt ?? obj.en ?? '';
  };

  const headers =
    cvT === 'pt'
      ? {
          summary: 'APRESENTAÇÃO',
          education: 'FORMAÇÃO ACADÊMICA',
          experiences: 'EXPERIÊNCIAS PROFISSIONAIS E ACADÊMICAS',
          projects: 'PROJETOS SELECIONADOS',
          skills: 'COMPETÊNCIAS & FERRAMENTAS',
          softSkills: 'PERFIL PROFISSIONAL & DIFERENCIAIS',
        }
      : {
          summary: 'PROFESSIONAL SUMMARY',
          education: 'EDUCATION',
          experiences: 'WORK & ACADEMIC EXPERIENCE',
          projects: 'SELECTED PROJECTS',
          skills: 'TECHNICAL SKILLS & TOOLS',
          softSkills: 'SOFT SKILLS & LANGUAGES',
        };

  const activeEducation = profile.education.filter((e) =>
    draft.selectedEducation.includes(e.id)
  );
  const activeExperiences = experiences.filter((e) =>
    draft.selectedExperiences.includes(e.id)
  );
  const activeProjects = projects.filter((p) =>
    draft.selectedProjects.includes(p.id)
  );
  const activeDevSkills = skills.filter((s) =>
    draft.selectedDevSkills.includes(s.id)
  );
  const activeDesignSkills = designCapabilities.filter((d) =>
    draft.selectedDesignSkills.includes(d.id)
  );
  const activeSoftSkills = profile.softSkills.filter((s) =>
    draft.selectedSoftSkills.includes(s.id)
  );

  return (
    <div className="cvlab-page container">
      {/* Header (hidden on print) */}
      <header className="cvlab-header no-print" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <Link to="/" className="btn-secondary">
            <ArrowLeft size={16} />
            <span>{t.cvLab.backBtn}</span>
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            <a
              href={profile.cvPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <Download size={16} />
              <span>{t.hero.ctaDownloadCv}</span>
            </a>

            <button type="button" className="btn-primary" onClick={handlePrint}>
              <Printer size={18} />
              <span>{t.cvLab.printBtn}</span>
            </button>
          </div>
        </div>

        <h1 className="section-heading" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
          {t.cvLab.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px' }}>
          {t.cvLab.subtitle}
        </p>
      </header>

      <div className="cvlab-layout">
        {/* Controls Panel (hidden on print) */}
        <aside className="cvlab-controls no-print" data-no-spray="true">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button type="button" className="timeline-filter-btn" onClick={() => applyPreset('dev')}>
              <Code2 size={14} style={{ display: 'inline', marginRight: 5 }} />
              {t.cvLab.presetDev}
            </button>
            <button type="button" className="timeline-filter-btn" onClick={() => applyPreset('design')}>
              <Palette size={14} style={{ display: 'inline', marginRight: 5 }} />
              {t.cvLab.presetDesign}
            </button>
            <button type="button" className="timeline-filter-btn" onClick={() => applyPreset('full')}>
              <CheckSquare size={14} style={{ display: 'inline', marginRight: 5 }} />
              {t.cvLab.presetFull}
            </button>
            <button
              type="button"
              className="timeline-filter-btn"
              onClick={() => setDraft(buildPreset('dev', 'pt'))}
              title={t.cvLab.resetBtn}
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="cvlab-field">
            <label htmlFor="cv-lang">{t.cvLab.fields.cvLang}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`timeline-filter-btn ${draft.cvLang === 'pt' ? 'active' : ''}`}
                onClick={() => handleCvLangChange('pt')}
              >
                Português (PT-BR)
              </button>
              <button
                type="button"
                className={`timeline-filter-btn ${draft.cvLang === 'en' ? 'active' : ''}`}
                onClick={() => handleCvLangChange('en')}
              >
                English (EN)
              </button>
            </div>
          </div>

          <div className="cvlab-field">
            <label>{t.cvLab.fields.layoutStyle}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`timeline-filter-btn ${draft.layoutStyle === 'classic' ? 'active' : ''}`}
                onClick={() => setDraft((p) => ({ ...p, layoutStyle: 'classic' }))}
              >
                {t.cvLab.fields.classicAts}
              </button>
              <button
                type="button"
                className={`timeline-filter-btn ${draft.layoutStyle === 'editorial' ? 'active' : ''}`}
                onClick={() => setDraft((p) => ({ ...p, layoutStyle: 'editorial' }))}
              >
                {t.cvLab.fields.editorialBrand}
              </button>
            </div>
          </div>

          <div className="cvlab-field">
            <label htmlFor="cv-role">{t.cvLab.fields.role}</label>
            <input
              id="cv-role"
              type="text"
              className="cvlab-input"
              value={draft.targetRole}
              onChange={(e) => setDraft((p) => ({ ...p, targetRole: e.target.value }))}
            />
          </div>

          <div className="cvlab-field">
            <label htmlFor="cv-summary">{t.cvLab.fields.summary}</label>
            <textarea
              id="cv-summary"
              rows={4}
              className="cvlab-textarea"
              value={draft.summary}
              onChange={(e) => setDraft((p) => ({ ...p, summary: e.target.value }))}
            />
          </div>

          {/* Education Selection */}
          <div className="cvlab-field">
            <label>{t.cvLab.fields.sections.education}</label>
            <div className="cvlab-checklist">
              {profile.education.map((edu) => (
                <label key={edu.id} className="cvlab-check-item">
                  <input
                    type="checkbox"
                    checked={draft.selectedEducation.includes(edu.id)}
                    onChange={() => toggleItem('selectedEducation', edu.id)}
                  />
                  <span>{tr(edu.course)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experiences Selection */}
          <div className="cvlab-field">
            <label>{t.cvLab.fields.sections.experiences}</label>
            <div className="cvlab-checklist">
              {experiences.map((exp) => (
                <label key={exp.id} className="cvlab-check-item">
                  <input
                    type="checkbox"
                    checked={draft.selectedExperiences.includes(exp.id)}
                    onChange={() => toggleItem('selectedExperiences', exp.id)}
                  />
                  <span>{tr(exp.title)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Projects Selection */}
          <div className="cvlab-field">
            <label>{t.cvLab.fields.sections.projects}</label>
            <div className="cvlab-checklist">
              {projects.map((proj) => (
                <label key={proj.id} className="cvlab-check-item">
                  <input
                    type="checkbox"
                    checked={draft.selectedProjects.includes(proj.id)}
                    onChange={() => toggleItem('selectedProjects', proj.id)}
                  />
                  <span>{tr(proj.title)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dev Skills Selection */}
          <div className="cvlab-field">
            <label>{t.cvLab.fields.sections.devSkills}</label>
            <div className="cvlab-checklist" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {skills.map((s) => (
                <label key={s.id} className="cvlab-check-item" style={{ width: '47%' }}>
                  <input
                    type="checkbox"
                    checked={draft.selectedDevSkills.includes(s.id)}
                    onChange={() => toggleItem('selectedDevSkills', s.id)}
                  />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Design Skills Selection */}
          <div className="cvlab-field">
            <label>{t.cvLab.fields.sections.designSkills}</label>
            <div className="cvlab-checklist">
              {designCapabilities.map((d) => (
                <label key={d.id} className="cvlab-check-item">
                  <input
                    type="checkbox"
                    checked={draft.selectedDesignSkills.includes(d.id)}
                    onChange={() => toggleItem('selectedDesignSkills', d.id)}
                  />
                  <span>{d.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Soft Skills Selection */}
          <div className="cvlab-field">
            <label>{t.cvLab.fields.sections.softSkills}</label>
            <div className="cvlab-checklist">
              {profile.softSkills.map((sk) => (
                <label key={sk.id} className="cvlab-check-item">
                  <input
                    type="checkbox"
                    checked={draft.selectedSoftSkills.includes(sk.id)}
                    onChange={() => toggleItem('selectedSoftSkills', sk.id)}
                  />
                  <span>{tr(sk)}</span>
                </label>
              ))}
            </div>
          </div>

          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            ✓ {t.cvLab.savedToast}
          </span>
        </aside>

        {/* Live A4 Preview */}
        <div className="cv-paper-wrap">
          <div className={`cv-paper ${draft.layoutStyle === 'editorial' ? 'is-editorial' : ''}`}>
            <header className="cv-paper-header">
              <h1>{profile.name}</h1>
              <div className="cv-paper-role">{draft.targetRole}</div>
              <div className="cv-paper-contact">
                <span>{profile.location}</span>
                <span>•</span>
                <span>{profile.phoneDisplay}</span>
                <span>•</span>
                <span>{profile.email}</span>
                <span>•</span>
                <span>github.com/Vinnywho</span>
                <span>•</span>
                <span>linkedin.com/in/vinicius-cardoso-de-lima</span>
              </div>
            </header>

            {draft.summary.trim() && (
              <section className="cv-paper-section">
                <h2>{headers.summary}</h2>
                <p style={{ fontSize: '0.85rem', color: '#222' }}>{draft.summary}</p>
              </section>
            )}

            {activeEducation.length > 0 && (
              <section className="cv-paper-section">
                <h2>{headers.education}</h2>
                {activeEducation.map((edu) => (
                  <div key={edu.id} className="cv-paper-entry">
                    <div className="cv-paper-entry-head">
                      <span>{resText(edu.course)}</span>
                      <span style={{ fontWeight: 500, color: '#555' }}>{resText(edu.period)}</span>
                    </div>
                    <div style={{ color: '#444', fontWeight: 600 }}>{edu.institution}</div>
                    <div style={{ color: '#555', fontSize: '0.8rem' }}>{resText(edu.details)}</div>
                  </div>
                ))}
              </section>
            )}

            {activeExperiences.length > 0 && (
              <section className="cv-paper-section">
                <h2>{headers.experiences}</h2>
                {activeExperiences.map((exp) => (
                  <div key={exp.id} className="cv-paper-entry">
                    <div className="cv-paper-entry-head">
                      <span>
                        {resText(exp.title)} — <em style={{ fontWeight: 500 }}>{exp.organization}</em>
                      </span>
                      <span style={{ fontWeight: 500, color: '#555' }}>{resText(exp.period)}</span>
                    </div>
                    <p style={{ color: '#333', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      {resText(exp.shortDesc)}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {activeProjects.length > 0 && (
              <section className="cv-paper-section">
                <h2>{headers.projects}</h2>
                {activeProjects.map((proj) => (
                  <div key={proj.id} className="cv-paper-entry">
                    <div className="cv-paper-entry-head">
                      <span>{resText(proj.title)}</span>
                      <span style={{ fontWeight: 500, color: '#555' }}>
                        {proj.techs.map((tItem) => tItem.name).join(' • ')}
                      </span>
                    </div>
                    <p style={{ color: '#333', fontSize: '0.8rem' }}>{resText(proj.shortDesc)}</p>
                  </div>
                ))}
              </section>
            )}

            {(activeDevSkills.length > 0 || activeDesignSkills.length > 0) && (
              <section className="cv-paper-section">
                <h2>{headers.skills}</h2>
                {activeDevSkills.length > 0 && (
                  <p style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <strong>Tech & Stack: </strong>
                    {activeDevSkills.map((s) => s.name).join(', ')}.
                  </p>
                )}
                {activeDesignSkills.length > 0 && (
                  <p style={{ fontSize: '0.82rem' }}>
                    <strong>Design & UI/UX: </strong>
                    {activeDesignSkills.map((d) => d.name).join(', ')}.
                  </p>
                )}
              </section>
            )}

            {activeSoftSkills.length > 0 && (
              <section className="cv-paper-section">
                <h2>{headers.softSkills}</h2>
                <p style={{ fontSize: '0.82rem', color: '#222' }}>
                  {activeSoftSkills.map((sk) => resText(sk)).join(' • ')}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
