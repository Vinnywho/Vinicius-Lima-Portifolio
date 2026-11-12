import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUp, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/profile';

export default function Footer() {
  const { t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer no-print">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">ViNiCiuS LiMa</div>
            <div className="footer-status">
              <span className="status-pulse" aria-hidden="true" />
              <span>{t.footer.available}</span>
            </div>
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.88rem',
                opacity: 0.72,
              }}
            >
              <MapPin size={15} />
              <span>{profile.location}</span>
            </p>
          </div>

          <div className="footer-col">
            <h3>{t.footer.navigation}</h3>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => goToSection('home')}>
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => goToSection('sobre')}>
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => goToSection('projetos')}>
                  {t.nav.projects}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => goToSection('experiencias')}>
                  {t.nav.experiences}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => goToSection('faq')}>
                  {t.nav.faq}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/spray-lab');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {t.nav.sprayLab}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/cv-lab');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {t.nav.cvLab}
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>{t.footer.connect}</h3>
            <ul className="footer-links">
              <li>
                <a href={profile.links.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.links.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`}>Email</a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${profile.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <button
              type="button"
              className="footer-top-btn"
              onClick={scrollToTop}
              aria-label={t.footer.backToTop}
              title={t.footer.backToTop}
            >
              <ArrowUp size={22} />
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} {profile.name}
          </span>
          <span>{t.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
