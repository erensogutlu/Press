import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const YazarBolumu = ({ yazilar }) => {
  return (
    <div style={{ marginBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>KÖŞE YAZARLARI</h2>
        <Link to="/kose-yazilari" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Tümünü Gör <ChevronRight size={18} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {yazilar.map((yazi, i) => (
          <motion.div
            key={yazi.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'var(--surface)',
              padding: '1.5rem',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img 
                src={yazi.yazar_resmi} 
                alt={yazi.yazar_adi} 
                style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{yazi.yazar_adi}</span>
            </div>
            <Link to={`/kose-yazisi/${yazi.id}`}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.3, height: '2.6em', overflow: 'hidden' }}>
                {yazi.baslik}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default YazarBolumu;
