import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const EditorunSectikleri = ({ haberler }) => {
  const [indeks, setIndeks] = useState(0);

  useEffect(() => {
    const zamanlayici = setInterval(() => {
      setIndeks((prev) => (prev + 1) % haberler.length);
    }, 6000);
    return () => clearInterval(zamanlayici);
  }, [haberler.length]);

  if (!haberler || haberler.length === 0) return null;

  const aktifHaber = haberler[indeks];

  return (
    <div style={{ marginBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--accent)', padding: '0.4rem', borderRadius: '8px', color: 'white' }}>
            <Star size={20} fill="currentColor" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>EDİTÖRÜN SEÇTİKLERİ</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setIndeks((indeks - 1 + haberler.length) % haberler.length)}
            style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setIndeks((indeks + 1) % haberler.length)}
            style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* ana slider alanı */}
        <div style={{ gridColumn: 'span 2', background: 'var(--surface)', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', height: '400px' }} className="editor-ana-kart">
          <AnimatePresence mode="wait">
            <motion.div
              key={aktifHaber.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', height: '100%' }}
              className="editor-grid"
            >
              <Link to={`/haber/${aktifHaber.id}`} style={{ display: 'block', height: '100%' }}>
                <img src={aktifHaber.resim_url} alt={aktifHaber.baslik} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{aktifHaber.kategori_adi}</span>
                <Link to={`/haber/${aktifHaber.id}`}>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '1rem 0', lineHeight: 1.2 }}>{aktifHaber.baslik}</h3>
                </Link>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {aktifHaber.ozet}
                </p>
                <Link to={`/haber/${aktifHaber.id}`} style={{ alignSelf: 'flex-start', padding: '0.6rem 1.5rem', borderRadius: '100px', background: 'var(--accent)', color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>
                  Haberi Oku
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* yan liste - aktif olmayanları gösterir */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {haberler.map((haber, i) => (
            <motion.div 
              key={haber.id}
              onClick={() => setIndeks(i)}
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center', 
                padding: '0.75rem', 
                borderRadius: '16px',
                cursor: 'pointer',
                background: i === indeks ? 'var(--glass-bg)' : 'transparent',
                border: i === indeks ? '1px solid var(--glass-border)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ width: '70px', height: '50px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                <img src={haber.resim_url} alt={haber.baslik} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{haber.baslik}</h4>
                <span style={{ fontSize: '0.7rem', color: i === indeks ? 'var(--accent)' : 'var(--text-muted)' }}>{haber.kategori_adi}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .editor-ana-kart {
            grid-column: span 1 !important;
            height: auto !important;
          }
          .editor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EditorunSectikleri;
