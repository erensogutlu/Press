import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Kayit = () => {
  const [isim, setIsim] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const { giris } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const yanit = await axios.post('http://localhost:5000/api/kayit', { isim, eposta, sifre });
      giris(yanit.data);
      navigate('/');
    } catch (hata) {
      setHata(hata.response?.data?.hata || 'Kayıt sırasında bir hata oluştu');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ padding: '3rem', borderRadius: '32px', width: '100%', maxWidth: '450px' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', textAlign: 'center' }}>Kaydol</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>PRESS dünyasına katılın.</p>

        {hata && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{hata}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <User size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              required
              type="text" 
              placeholder="Ad Soyad"
              value={isim}
              onChange={(e) => setIsim(e.target.value)}
              className="auth-input"
            />
          </div>

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
            Kayıt Ol <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Zaten hesabınız var mı? <Link to="/giris" style={{ color: 'var(--accent)', fontWeight: '700' }}>Giriş Yap</Link>
        </p>
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

export default Kayit;
