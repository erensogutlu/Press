import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, Eye, User, ChevronLeft, Share2 } from 'lucide-react';

const HaberDetay = () => {
  const { id } = useParams();
  const [haber, setHaber] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const haberDetayiGetir = async () => {
      try {
        const yanit = await axios.get(`/api/haberler/${id}`);
        setHaber(yanit.data);
      } catch (hata) {
        console.error('haber detayı yüklenemedi:', hata);
      } finally {
        setYukleniyor(false);
      }
    };
    haberDetayiGetir();
    window.scrollTo(0, 0);
  }, [id]);

  if (yukleniyor) return <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="yukleme-cubugu"></div></div>;
  if (!haber) return <div className="container"><h1>Haber bulunamadı.</h1></div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container" 
      style={{ paddingTop: '2rem', maxWidth: '800px' }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
        <ChevronLeft size={18} /> Geri Dön
      </Link>

      <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>
        {haber.kategori_adi.toUpperCase()}
      </span>
      
      <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.1, margin: '1rem 0 1.5rem 0' }}>
        {haber.baslik}
      </h1>

      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '2rem', borderLeft: '4px solid var(--accent)', paddingLeft: '1.5rem' }}>
        {haber.ozet}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', padding: '1.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={haber.yazar_resmi} alt={haber.yazar_adi} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: '600' }}>{haber.yazar_adi}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yazar</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {new Date(haber.tarih).toLocaleDateString('tr-TR')}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Eye size={16} /> {haber.goruntulenme_sayisi}</span>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: haber.baslik,
                  text: haber.ozet,
                  url: window.location.href,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Bağlantı kopyalandı!');
              }
            }}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <img src={haber.resim_url} alt={haber.baslik} style={{ width: '100%', borderRadius: '24px', marginBottom: '3rem' }} />

      <div className="haber-icerik" style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
        {haber.icerik.split('\n').map((paragraf, i) => (
          <p key={i} style={{ marginBottom: '1.5rem' }}>{paragraf}</p>
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
        @media (max-width: 768px) {
          h1 { fontSize: 2rem !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default HaberDetay;
