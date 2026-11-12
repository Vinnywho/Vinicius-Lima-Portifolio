import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FAQSection from '../components/FAQSection';

export default function FAQ() {
  const { t, navigateWithTransition } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <article className="detail-page container" style={{ maxWidth: '960px' }}>
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

      <FAQSection isPage />
    </article>
  );
}
