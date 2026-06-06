import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Anasayfa from './pages/Anasayfa';
import HaberDetay from './pages/HaberDetay';
import KategoriSayfasi from './pages/KategoriSayfasi';
import AramaSonuclari from './pages/AramaSonuclari';
import KoseYazilari from './pages/KoseYazilari';
import KoseYazisiDetay from './pages/KoseYazisiDetay';
import Kayit from './pages/Kayit';
import Giris from './pages/Giris';
import AdminPanel from './pages/AdminPanel';
import YazarPanel from './pages/YazarPanel';
import Bildirimler from './pages/Bildirimler';
import { AuthProvider } from './context/AuthContext';

import { Code } from 'lucide-react';

// ana bileşenleri kontrol eden iç sarmalayıcı
const AppContent = () => {
  const location = useLocation();
  const isPanel = location.pathname === '/admin' || location.pathname === '/yazar';

  return (
    <>
      <ScrollToTop />
      {!isPanel && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Anasayfa />} />
          <Route path="/haber/:id" element={<HaberDetay />} />
          <Route path="/kategori/:slug" element={<KategoriSayfasi />} />
          <Route path="/arama" element={<AramaSonuclari />} />
          <Route path="/kose-yazilari" element={<KoseYazilari />} />
          <Route path="/kose-yazisi/:id" element={<KoseYazisiDetay />} />
          <Route path="/kayit" element={<Kayit />} />
          <Route path="/giris" element={<Giris />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/yazar" element={<YazarPanel />} />
          <Route path="/bildirimler" element={<Bildirimler />} />
        </Routes>
      </main>
      {!isPanel && (
        <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>&copy; 2026 PRESS Haber Portalı. Tüm Hakları Saklıdır.</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://github.com/erensogutlu"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                background: 'rgba(255,255,255,0.03)',
                padding: '0.5rem 1.25rem',
                borderRadius: '100px',
                border: '1px solid var(--border)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <Code size={18} />
              <span>Geliştirici: Eren Söğütlü</span>
            </a>
          </div>
        </footer>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
