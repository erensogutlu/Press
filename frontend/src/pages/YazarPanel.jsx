import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PenTool, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const YazarPanel = () => {
  const { kullanici, cikis } = useAuth();
  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [durum, setDurum] = useState({ tip: '', mesaj: '' });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [yazilarim, setYazilarim] = useState([]);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  React.useEffect(() => {
    const yazilariGetir = async () => {
      if (kullanici) {
        try {
          const yanit = await axios.get(`http://localhost:5000/api/yazar/yazilar/${kullanici.id}`);
          setYazilarim(yanit.data);
        } catch (hata) {
          console.error('yazılar yüklenemedi:', hata);
        }
      }
    };
    yazilariGetir();
  }, [kullanici]);

  if (!kullanici) return <Navigate to="/giris" />;
  if (kullanici.rol !== 'yazar' && kullanici.rol !== 'admin') return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setYukleniyor(true);
    setDurum({ tip: '', mesaj: '' });

    try {
      if (duzenlemeModu) {
        await axios.put(`http://localhost:5000/api/kose-yazilari/${duzenlenenId}`, { baslik, icerik });
        setDurum({ tip: 'basari', mesaj: 'Yazınız başarıyla güncellendi!' });
      } else {
        await axios.post('http://localhost:5000/api/yazar/yazi-paylas', {
          baslik,
          icerik,
          yazar_id: kullanici.id 
        });
        setDurum({ tip: 'basari', mesaj: 'Köşe yazınız başarıyla yayına alındı!' });
      }
      setBaslik('');
      setIcerik('');
      setDuzenlemeModu(false);
      setDuzenlenenId(null);
      
      // yazıları yenile
      const yanit = await axios.get(`http://localhost:5000/api/yazar/yazilar/${kullanici.id}`);
      setYazilarim(yanit.data);
    } catch (hata) {
      setDurum({ tip: 'hata', mesaj: 'İşlem sırasında bir hata oluştu.' });
    } finally {
      setYukleniyor(false);
    }
  };

  const yaziyiDuzenle = (yazi) => {
    setBaslik(yazi.baslik);
    setIcerik(yazi.icerik);
    setDuzenlemeModu(true);
    setDuzenlenenId(yazi.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', maxWidth: '800px', paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#8b5cf6', padding: '0.5rem', borderRadius: '10px', color: 'white' }}>
            <PenTool size={20} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900' }}>{duzenlemeModu ? 'Yazıyı Düzenle' : 'Yeni Yazı Girişi'}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {duzenlemeModu && (
            <button 
              onClick={() => {
                setDuzenlemeModu(false);
                setDuzenlenenId(null);
                setBaslik('');
                setIcerik('');
              }}
              style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}
            >
              Vazgeç
            </button>
          )}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{kullanici.isim.toUpperCase()}</span>
          <Link to="/" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>Siteye Dön</Link>
          <button onClick={cikis} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>Çıkış</button>
        </div>
      </div>

      {durum.mesaj && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: durum.tip === 'basari' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: durum.tip === 'basari' ? '#10b981' : '#ef4444', 
            padding: '1rem 1.5rem', 
            borderRadius: '12px', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          {durum.tip === 'basari' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{durum.mesaj}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <input 
          required
          type="text"
          placeholder="Yazı Başlığı..."
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderLeft: '4px solid #8b5cf6',
            padding: '1rem 1.5rem',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '900',
            outline: 'none'
          }}
        />

        <textarea 
          required
          placeholder="Yazınızın içeriğini buraya girin..."
          value={icerik}
          onChange={(e) => setIcerik(e.target.value)}
          style={{
            width: '100%',
            height: '500px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            padding: '2rem',
            borderRadius: '24px',
            color: 'var(--text)',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            outline: 'none',
            resize: 'none',
            fontFamily: 'serif'
          }}
        ></textarea>

        <button 
          type="submit" 
          disabled={yukleniyor}
          style={{ 
            background: '#8b5cf6', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '12px', 
            border: 'none', 
            fontSize: '1rem', 
            fontWeight: '800', 
            cursor: yukleniyor ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          {yukleniyor ? 'İşleniyor...' : (duzenlemeModu ? 'Değişiklikleri Kaydet' : 'Yazıyı Yayınla')}
          <Send size={18} />
        </button>
      </form>

      {/* yazılarım listesi */}
      <div style={{ marginTop: '5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PenTool size={20} color="#8b5cf6" />
          Paylaştığım Yazılar
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {yazilarim.map(yazi => (
            <div key={yazi.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.25rem' }}>{yazi.baslik}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(yazi.tarih).toLocaleDateString('tr-TR')}</div>
              </div>
              <button 
                onClick={() => yaziyiDuzenle(yazi)}
                style={{ padding: '0.5rem 1.2rem', borderRadius: '100px', border: '1px solid #8b5cf6', color: '#8b5cf6', fontSize: '0.8rem', fontWeight: '700', transition: 'all 0.3s ease' }}
              >
                Düzenle
              </button>
            </div>
          ))}
          {yazilarim.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Henüz bir yazı paylaşmamışsınız.</p>}
        </div>
      </div>
    </div>
  );
};

export default YazarPanel;
