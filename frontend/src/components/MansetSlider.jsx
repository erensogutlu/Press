import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const MansetSlider = ({ haberler }) => {
  const [indeks, setIndeks] = useState(0);

  useEffect(() => {
    const zamanlayici = setInterval(() => {
      setIndeks((prev) => (prev + 1) % haberler.length);
    }, 5000);
    return () => clearInterval(zamanlayici);
  }, [haberler.length]);

  const sonraki = () => setIndeks((indeks + 1) % haberler.length);
  const onceki = () => setIndeks((indeks - 1 + haberler.length) % haberler.length);

  return (
    <div style={{ position: 'relative', height: '550px', borderRadius: '32px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={haberler[indeks].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', height: '100%', width: '100%' }}
        >
          <img 
            src={haberler[indeks].resim_url} 
            alt={haberler[indeks].baslik} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '4rem 3rem',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)',
            color: 'white'
          }}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'inline-block',
                background: 'var(--accent)',
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: '700',
                marginBottom: '1.5rem'
              }}
            >
              {haberler[indeks].kategori_adi.toUpperCase()}
            </motion.span>
            <Link to={`/haber/${haberler[indeks].id}`}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontSize: '3rem', fontWeight: '900', lineHeight: 1.1, marginBottom: '1rem', maxWidth: '800px' }}
              >
                {haberler[indeks].baslik}
              </motion.h1>
            </Link>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', maxWidth: '700px', marginBottom: '2rem' }}
            >
              {haberler[indeks].ozet}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* kontroller */}
      <div style={{ position: 'absolute', bottom: '3rem', right: '3rem', display: 'flex', gap: '1rem' }}>
        <button onClick={onceki} className="slider-btn"><ChevronLeft size={24} /></button>
        <button onClick={sonraki} className="slider-btn"><ChevronRight size={24} /></button>
      </div>

      {/* noktalar */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
        {haberler.map((_, i) => (
          <div 
            key={i} 
            onClick={() => setIndeks(i)}
            style={{
              width: i === indeks ? '30px' : '8px',
              height: '8px',
              borderRadius: '10px',
              background: i === indeks ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <style>{`
        .slider-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .slider-btn:hover {
          background: var(--accent);
          transform: scale(1.1);
        }
        @media (max-width: 768px) {
          h1 { font-size: 2rem !important; }
          div[style*="padding: 4rem 3rem"] { padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default MansetSlider;
