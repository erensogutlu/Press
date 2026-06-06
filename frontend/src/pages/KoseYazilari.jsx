import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronRight } from 'lucide-react';

const KoseYazilari = () => {
  const [yazilar, setYazilar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const yazilariGetir = async () => {
      try {
        const yanit = await axios.get('http://localhost:5000/api/kose-yazilari');
        setYazilar(yanit.data);
      } catch (hata) {
        console.error('köşe yazıları yüklenemedi:', hata);
      } finally {
        setYukleniyor(false);
      }
    };
    yazilariGetir();
  }, []);

  if (yukleniyor) return <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="yukleme-cubugu"></div></div>;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800' }} className="gradient-text">Köşe Yazıları</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Günün öne çıkan analizleri ve yorumları.</p>
        <div style={{ height: '4px', width: '60px', background: 'var(--accent)', marginTop: '0.5rem' }}></div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {yazilar.map((yazi, indeks) => (
          <motion.div 
            key={yazi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: indeks * 0.1 }}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={yazi.yazar_resmi} alt={yazi.yazar_adi} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>{yazi.yazar_adi}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> {new Date(yazi.tarih).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.2 }}>{yazi.baslik}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {yazi.icerik}
              </p>
            </div>

            <Link to={`/kose-yazisi/${yazi.id}`} style={{ 
              marginTop: 'auto', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'var(--accent)', 
              fontWeight: '700',
              fontSize: '0.9rem'
            }}>
              Yazının Devamı <ChevronRight size={18} />
            </Link>
          </motion.div>
        ))}
      </div>

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

export default KoseYazilari;
