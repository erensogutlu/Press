import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import HaberKarti from '../components/HaberKarti';
import { motion } from 'framer-motion';

const AramaSonuclari = () => {
  const [haberler, setHaberler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const konum = useLocation();
  const sorguParametresi = new URLSearchParams(konum.search).get('q');

  useEffect(() => {
    const aramaYap = async () => {
      if (!sorguParametresi) return;
      setYukleniyor(true);
      try {
        const yanit = await axios.get(`http://localhost:5000/api/arama?q=${encodeURIComponent(sorguParametresi)}`);
        setHaberler(yanit.data);
      } catch (hata) {
        console.error('arama sonuçları yüklenemedi:', hata);
      } finally {
        setYukleniyor(false);
      }
    };
    aramaYap();
  }, [sorguParametresi]);

  if (yukleniyor) return <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="yukleme-cubugu"></div></div>;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>
          "{sorguParametresi}" için sonuçlar
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{haberler.length} haber bulundu.</p>
        <div style={{ height: '4px', width: '60px', background: 'var(--accent)', marginTop: '0.5rem' }}></div>
      </header>

      {haberler.length > 0 ? (
        <div className="haber-izgarasi" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {haberler.map((haber, indeks) => (
            <motion.div 
              key={haber.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: indeks * 0.1 }}
            >
              <HaberKarti haber={haber} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Aradığınız kriterlere uygun haber bulunamadı.</p>
        </div>
      )}

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

export default AramaSonuclari;
