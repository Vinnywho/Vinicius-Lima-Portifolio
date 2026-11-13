import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import SprayCanvas from './components/SprayCanvas';
import ModeTransition from './components/ModeTransition';
import FloatingMenu from './components/FloatingMenu';
import ContactWhatsApp from './components/ContactWhatsApp';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import DesignShowcase from './pages/DesignShowcase';
import ResumeLab from './pages/ResumeLab';
import FAQ from './pages/FAQ';
import SprayLab from './pages/SprayLab';

function AppShell() {
  const location = useLocation();
  const isSprayLab = location.pathname === '/spray-lab';

  return (
    <>
      {!isSprayLab && <SprayCanvas />}
      <ModeTransition />
      <FloatingMenu />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projeto/:slug" element={<ProjectDetail />} />
          <Route path="/design/:slug" element={<DesignShowcase />} />
          <Route path="/cv-lab" element={<ResumeLab />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/spray-lab" element={<SprayLab />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <ContactWhatsApp />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
