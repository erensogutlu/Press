import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronLeft, Share2, Quote } from 'lucide-react';

const KoseYazisiDetay = () => {
  const { id } = useParams();
  const [yazi, setYazi] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const yaziDetayiGetir = async () => {
      try {
        const yanit = await axios.get(`http://localhost:5000/api/kose-yazilari/${id}`);
        setYazi(yanit.data);
      } catch (hata) {
        console.error('yazı detayı yüklenemedi:', hata);
      } finally {
        setYukleniyor(false);
      }
    };
    yaziDetayiGetir();
    window.scrollTo(0, 0);
  }, [id]);

  if (yukleniyor) return <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="yukleme-cubugu"></div></div>;
  if (!yazi) return <div className="container"><h1>Yazı bulunamadı.</h1></div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container" 
      style={{ paddingTop: '4rem', maxWidth: '800px' }}
    >
      <Link to="/kose-yazilari" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>
        <ChevronLeft size={18} /> Tüm Köşe Yazıları
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <img src={yazi.yazar_resmi} alt={yazi.yazar_adi} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--surface)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
        </motion.div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent)' }}>{yazi.yazar_adi}</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Calendar size={14} /> {new Date(yazi.tarih).toLocaleDateString('tr-TR')}
        </div>
      </div>

      <header style={{ marginBottom: '3rem', position: 'relative' }}>
        <Quote size={48} style={{ position: 'absolute', top: '-2rem', left: '-2rem', color: 'var(--surface)', zIndex: -1 }} />
        <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: 1.1, textAlign: 'center' }}>
          {yazi.baslik}
        </h1>
      </header>

      <div className="yazi-icerik" style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.95)', whiteSpace: 'pre-wrap' }}>
        {yazi.icerik.split('\n').map((paragraf, i) => (
          <p key={i} style={{ marginBottom: '2rem' }}>{paragraf}</p>
        ))}
      </div>

      <div style={{ marginTop: '5rem', padding: '3rem', background: 'var(--surface)', borderRadius: '32px', border: '1px solid var(--border)', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Bu yazıyı beğendiniz mi?</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: yazi.baslik,
                  text: yazi.yazar_adi + ' - ' + yazi.baslik,
                  url: window.location.href,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Bağlantı kopyalandı!');
              }
            }}
            style={{ background: 'var(--accent)', color: 'white', padding: '0.8rem 2rem', borderRadius: '100px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            <Share2 size={18} /> Paylaş
          </button>
        </div>
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
          h1 { font-size: 2.2rem !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default KoseYazisiDetay;
