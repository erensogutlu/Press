import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Giris = () => {
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const { giris } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const yanit = await axios.post('/api/giris', { eposta, sifre });
      giris(yanit.data);
      navigate('/');
    } catch (hata) {
      setHata(hata.response?.data?.hata || 'Giriş yapılamadı');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', paddingTop: '4rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ padding: '3rem', borderRadius: '32px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', textAlign: 'center' }}>Giriş Yap</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Kaldığınız yerden devam edin.</p>

        {hata && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{hata}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <Mail size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              required
              type="email" 
              placeholder="E-posta"
              value={eposta}
              onChange={(e) => setEposta(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="input-group">
            <Lock size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              required
              type={sifreGoster ? "text" : "password"} 
              placeholder="Şifre"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="auth-input"
            />
            <button 
              type="button" 
              onClick={() => setSifreGoster(!sifreGoster)}
              style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {sifreGoster ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="auth-button">
            Giriş Yap <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Hesabınız yok mu? <Link to="/kayit" style={{ color: 'var(--accent)', fontWeight: '700' }}>Hemen Kaydolun</Link>
        </p>

        {/* örnek hesaplar alanı */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, var(--border))' }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>HIZLI GİRİŞ</span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--border), transparent)' }}></div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { rol: 'Admin', eposta: 'admin@press.com', renk: 'var(--accent)' },
              { rol: 'Yazar', eposta: 'yazar@press.com', renk: '#8b5cf6' },
              { rol: 'Üye', eposta: 'user@press.com', renk: '#10b981' }
            ].map((hesap) => (
              <button
                key={hesap.rol}
                onClick={() => { setEposta(hesap.eposta); setSifre('press123'); }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1rem 1.25rem', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = hesap.renk; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hesap.renk }}></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'white' }}>{hesap.rol}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{hesap.eposta}</div>
                  </div>
                </div>
                <ArrowRight size={14} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        .input-group { position: relative; width: 100%; }
        .auth-input {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 1rem 1rem 1rem 3.5rem;
          border-radius: 16px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .auth-input:focus { border-color: var(--accent); outline: none; }
        .auth-button {
          width: 100%;
          background: var(--accent);
          color: white;
          border: none;
          padding: 1.2rem;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }
        .auth-button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); }
      `}</style>
    </div>
  );
};

export default Giris;
