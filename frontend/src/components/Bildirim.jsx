import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bildirim = ({ haber }) => {
  const [gorunur, setGorunur] = useState(true);

  useEffect(() => {
    const zamanlayici = setTimeout(() => setGorunur(false), 5000);
    return () => clearTimeout(zamanlayici);
  }, []);

  return (
    <AnimatePresence>
      {gorunur && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            width: '320px',
            background: 'var(--surface)',
            border: '1px solid var(--accent)',
            borderRadius: '20px',
            padding: '1.25rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '12px', height: 'fit-content' }}>
              <Bell size={20} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase' }}>Yeni Haber!</span>
                <button onClick={() => setGorunur(false)}><X size={16} color="var(--text-muted)" /></button>
              </div>
              <Link to={`/haber/${haber.id}`} onClick={() => setGorunur(false)}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '0.5rem', lineHeight: 1.3 }}>{haber.baslik}</h4>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Bildirim;
