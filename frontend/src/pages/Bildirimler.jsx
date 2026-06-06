import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bell, ChevronRight, Clock, Shield, Newspaper, Trash2, CheckCircle } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Bildirimler = () => {
  const { kullanici } = useAuth();
  const [haberler, setHaberler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        const yanit = await axios.get('http://localhost:5000/api/haberler');
        setHaberler(yanit.data);
        
        // sayfaya bakıldığında en son haberin ID'sini "görüldü" olarak kaydet
        if (yanit.data.length > 0) {
          localStorage.setItem(`son_gorulen_bildirim_${kullanici?.id}`, yanit.data[0].id);
          // navbar'daki iconun güncellenmesi için bir event tetikleyebiliriz
          window.dispatchEvent(new Event('bildirim_okundu'));
        }
      } catch (hata) {
        console.error('bildirimler yüklenemedi:', hata);
      } finally {
        setYukleniyor(false);
      }
    };
    verileriGetir();
  }, [kullanici]);

  const hepsiniTemizle = () => {
    if (haberler.length === 0) return;
    if (window.confirm('Tüm bildirimleri temizlemek istediğinize emin misiniz?')) {
      // temizlenen haberlerin ID'lerini sakla
      const temizlenenIdler = JSON.parse(localStorage.getItem(`temizlenen_bildirimler_${kullanici?.id}`) || '[]');
      const yeniTemizlenenler = [...new Set([...temizlenenIdler, ...haberler.map(h => h.id)])];
      localStorage.setItem(`temizlenen_bildirimler_${kullanici?.id}`, JSON.stringify(yeniTemizlenenler));
      setHaberler([]);
    }
  };

  if (!kullanici) return <Navigate to="/giris" />;

  if (yukleniyor) {
    return (
      <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="yukleme-cubugu"></div>
      </div>
    );
  }

  // temizlenmemiş haberleri filtrele
  const temizlenenIdler = JSON.parse(localStorage.getItem(`temizlenen_bildirimler_${kullanici?.id}`) || '[]');
  const gorunurHaberler = haberler.filter(h => !temizlenenIdler.includes(h.id));

  return (
    <div className="container" style={{ paddingTop: '4rem', maxWidth: '800px', minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'var(--accent)', padding: '1rem', borderRadius: '20px', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}>
              <Bell size={32} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Bildirimler</h1>
              <p style={{ color: 'var(--text-muted)' }}>Sizin için seçilen son gelişmeler ve güncellemeler.</p>
            </div>
          </div>
          {gorunurHaberler.length > 0 && (
            <button 
              onClick={hepsiniTemizle}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem 1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}
            >
              <Trash2 size={18} /> Temizle
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {gorunurHaberler.map((haber, indeks) => (
            <motion.div
              key={haber.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: indeks * 0.05 }}
            >
              <Link 
                to={`/haber/${haber.id}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.5rem', 
                  padding: '1.5rem', 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '24px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  color: 'white'
                }}
                className="bildirim-karti"
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(10px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img src={haber.resim_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {haber.kategori_adi}
                    </span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }}></span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {new Date(haber.tarih).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: 1.4 }}>{haber.baslik}</h3>
                </div>

                <ChevronRight size={20} color="var(--border)" />
              </Link>
            </motion.div>
          ))}
        </div>

        {gorunurHaberler.length === 0 && (
          <div style={{ textAlign: 'center', padding: '8rem 0', color: 'var(--text-muted)' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <Newspaper size={64} style={{ opacity: 0.1 }} />
              <CheckCircle size={32} style={{ position: 'absolute', bottom: -5, right: -5, color: 'var(--accent)', opacity: 0.8 }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>Harika!</h3>
            <p>Okunmamış veya yeni bir bildiriminiz bulunmuyor.</p>
            <Link to="/" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem' }}>Anasayfaya Dön</Link>
          </div>
        )}
      </motion.div>

      <style>{`
        .yukleme-cubugu {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: don 1s linear infinite;
        }
        @keyframes don {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Bildirimler;
