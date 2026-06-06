import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Globe, Bell } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [acik, setAcik] = useState(false);
  const [aramaAcik, setAramaAcik] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [kategoriler, setKategoriler] = useState([]);
  const navigate = useNavigate();
  const { kullanici, cikis } = useAuth();
  const [yeniBildirimVar, setYeniBildirimVar] = useState(false);

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        const [katYanit, habYanit] = await Promise.all([
          axios.get('http://localhost:5000/api/kategoriler'),
          axios.get('http://localhost:5000/api/haberler')
        ]);
        setKategoriler(katYanit.data);
        
        if (kullanici) {
          const enSonHaberId = habYanit.data[0]?.id;
          const sonGorulenId = localStorage.getItem(`son_gorulen_bildirim_${kullanici.id}`);
          if (enSonHaberId && (!sonGorulenId || enSonHaberId > parseInt(sonGorulenId))) {
            setYeniBildirimVar(true);
          } else {
            setYeniBildirimVar(false);
          }
        }
      } catch (hata) {
        console.error('navbar veri çekme hatası:', hata);
      }
    };

    verileriGetir();
    const interval = setInterval(verileriGetir, 30000);

    const handleBildirimOkundu = () => setYeniBildirimVar(false);
    window.addEventListener('bildirim_okundu', handleBildirimOkundu);

    return () => {
      clearInterval(interval);
      window.removeEventListener('bildirim_okundu', handleBildirimOkundu);
    };
  }, [kullanici]);

  const aramaYap = (e) => {
    e.preventDefault();
    if (aramaMetni.trim()) {
      navigate(`/arama?q=${encodeURIComponent(aramaMetni)}`);
      setAramaAcik(false);
      setAramaMetni('');
    }
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo Bölümü */}
        <div style={{ flex: '0 0 auto' }}>
          <Link to="/" style={{ fontSize: '1.6rem', fontWeight: '950', letterSpacing: '-1.5px', textDecoration: 'none' }} className="gradient-text">
            PRESS
          </Link>
        </div>

        {/* Masaüstü Menü (Orta) */}
        <div style={{ display: 'none', gap: '1.5rem', alignItems: 'center', margin: '0 2rem' }} className="desktop-menu">
          <Link 
            to="/kose-yazilari"
            style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px' }}
            onMouseOver={(e) => e.target.style.color = 'var(--text)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            KÖŞE YAZILARI
          </Link>
          <div style={{ width: '1px', height: '15px', background: 'var(--border)' }}></div>
          {kategoriler.map((kategori) => (
            <Link 
              key={kategori.id} 
              to={`/kategori/${kategori.slug}`}
              style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px' }}
              onMouseOver={(e) => e.target.style.color = 'var(--text)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              {kategori.isim.toLocaleUpperCase('tr-TR')}
            </Link>
          ))}
        </div>
          
        {/* Sağ Taraf (Arama + Kullanıcı) */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.25rem' }} className="desktop-menu">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {aramaAcik ? (
              <form onSubmit={aramaYap} style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  autoFocus
                  type="text" 
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  placeholder="Haber ara..."
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    padding: '0.5rem 1.2rem',
                    color: 'white',
                    outline: 'none',
                    width: '180px',
                    fontSize: '0.8rem'
                  }}
                />
                <button type="button" onClick={() => setAramaAcik(false)} style={{ marginLeft: '-30px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button onClick={() => setAramaAcik(true)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <Search size={20} />
              </button>
            )}
          </div>

          <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>

          {kullanici ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/bildirimler" style={{ color: 'var(--text-muted)', position: 'relative', display: 'flex', padding: '5px' }} title="Bildirimler">
                <Bell size={20} />
                {yeniBildirimVar && (
                  <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', border: '2px solid var(--surface)' }}></span>
                )}
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {kullanici.rol === 'admin' && (
                  <>
                    <Link to="/admin" style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', padding: '0.4rem 0.9rem', borderRadius: '10px', textDecoration: 'none' }}>Admin</Link>
                    <Link to="/yazar" style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', padding: '0.4rem 0.9rem', borderRadius: '10px', textDecoration: 'none' }}>Yazar</Link>
                  </>
                )}
                {kullanici.rol === 'yazar' && (
                  <Link to="/yazar" style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', padding: '0.4rem 0.9rem', borderRadius: '10px', textDecoration: 'none' }}>Panel</Link>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', padding: '0.35rem 0.75rem', borderRadius: '100px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'white' }}>{kullanici.isim.split(' ')[0]}</span>
                <button 
                  onClick={cikis}
                  style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'none', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  title="Çıkış Yap"
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/giris" style={{ fontSize: '0.85rem', fontWeight: '700', padding: '0.5rem 1.2rem', color: 'white', textDecoration: 'none' }}>Giriş</Link>
              <Link to="/kayit" style={{ background: 'var(--accent)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>Kaydol</Link>
            </div>
          )}
        </div>

        {/* mobil menü butonu */}
        <div style={{ display: 'flex', gap: '1rem' }} className="mobile-toggle">
          <button onClick={() => setAramaAcik(!aramaAcik)} style={{ color: 'var(--text)' }}><Search size={24} /></button>
          <button onClick={() => setAcik(!acik)} style={{ color: 'var(--text)' }}>
            {acik ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* mobil arama çubuğu */}
      {aramaAcik && (
        <div className="glass mobile-toggle" style={{ padding: '1rem' }}>
          <form onSubmit={aramaYap} style={{ width: '100%' }}>
            <input 
              autoFocus
              type="text" 
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              placeholder="Haber ara..."
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '0.75rem',
                color: 'white',
                outline: 'none'
              }}
            />
          </form>
        </div>
      )}

      {/* mobil menü içeriği */}
      {acik && (
        <div className="glass" style={{ position: 'absolute', top: '100%', left: 0, right: 0, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Link 
            key="kose-yazilari" 
            to="/kose-yazilari" 
            onClick={() => setAcik(false)}
            style={{ fontSize: '1.2rem', fontWeight: '600' }}
          >
            Köşe Yazıları
          </Link>
          {kategoriler.map((kategori) => (
            <Link 
              key={kategori.id} 
              to={`/kategori/${kategori.slug}`} 
              onClick={() => setAcik(false)}
              style={{ fontSize: '1.2rem', fontWeight: '600' }}
            >
              {kategori.isim}
            </Link>
          ))}
          {kullanici ? (
            <>
              <Link to="/bildirimler" onClick={() => setAcik(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={20} /> Bildirimler
              </Link>
              {kullanici.rol === 'admin' && <Link to="/admin" onClick={() => setAcik(false)} style={{ color: 'var(--accent)' }}>Admin Paneli</Link>}
              {kullanici.rol === 'yazar' && <Link to="/yazar" onClick={() => setAcik(false)} style={{ color: '#8b5cf6' }}>Yazar Paneli</Link>}
              <button onClick={cikis} style={{ color: '#ef4444', textAlign: 'left', fontWeight: '700' }}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link to="/giris" onClick={() => setAcik(false)}>Giriş Yap</Link>
              <Link to="/kayit" onClick={() => setAcik(false)} style={{ color: 'var(--accent)' }}>Kaydol</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-menu { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
