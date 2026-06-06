import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

const HaberKarti = ({ haber, manset = false }) => {
  const tarihFormatla = (tarih) => {
    return new Date(tarih).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (manset) {
    return (
      <Link to={`/haber/${haber.id}`} className="manset-karti" style={{
        display: 'block',
        position: 'relative',
        height: '500px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <img src={haber.resim_url} alt={haber.baslik} style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '3rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <span style={{
            background: 'var(--accent)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: '700',
            width: 'fit-content',
            marginBottom: '1rem'
          }}>
            {haber.kategori_adi.toUpperCase()}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1rem' }}>
            {haber.baslik}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '1.5rem' }}>
            {haber.ozet}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {tarihFormatla(haber.tarih)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Eye size={16} /> {haber.goruntulenme_sayisi}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/haber/${haber.id}`} className="haber-karti" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '20px',
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      transition: 'transform 0.3s ease, border-color 0.3s ease'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.borderColor = 'var(--glass-border)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border)';
    }}>
      <div style={{ height: '200px', borderRadius: '14px', overflow: 'hidden' }}>
        <img src={haber.resim_url} alt={haber.baslik} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>
          {haber.kategori_adi.toUpperCase()}
        </span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: 1.3 }}>{haber.baslik}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {haber.ozet}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {tarihFormatla(haber.tarih)}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Eye size={14} /> {haber.goruntulenme_sayisi}</span>
        </div>
      </div>
    </Link>
  );
};

export default HaberKarti;
