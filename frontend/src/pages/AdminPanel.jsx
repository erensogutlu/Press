import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, FileText, Newspaper, Shield, Mail, Calendar, Send, Image, Tag, PlusCircle, Trash2, Play, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AdminPanel = () => {
  const { kullanici, cikis } = useAuth();
  const [istatistikler, setIstatistikler] = useState(null);
  const [kullanicilar, setKullanicilar] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [haberler, setHaberler] = useState([]);
  const [koseYazilari, setKoseYazilari] = useState([]);
  const [medyalar, setMedyalar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  // medya formu state'i
  const [medyaForm, setMedyaForm] = useState({ baslik: '', video_id: '' });

  // düzenleme modu state'i
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  // haber formu state'i
  const [haberForm, setHaberForm] = useState({
    baslik: '',
    ozet: '',
    icerik: '',
    resim_url: '',
    kategori_id: '',
    manset: false,
    editorun_sectigi: false
  });
  const [paylasiliyor, setPaylasiliyor] = useState(false);
  const [mesaj, setMesaj] = useState({ tip: '', icerik: '' });

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        const [istYanit, kulYanit, katYanit, habYanit, kyYanit, medYanit] = await Promise.all([
          axios.get('/api/admin/istatistikler'),
          axios.get('/api/admin/kullanicilar'),
          axios.get('/api/kategoriler'),
          axios.get('/api/haberler'),
          axios.get('/api/kose-yazilari'),
          axios.get('/api/medya')
        ]);
        setIstatistikler(istYanit.data);
        setKullanicilar(kulYanit.data);
        setKategoriler(katYanit.data);
        setHaberler(habYanit.data);
        setKoseYazilari(kyYanit.data);
        setMedyalar(medYanit.data);
      } catch (hata) {
        console.error('admin verileri yüklenemedi:', hata);
      } finally {
        setYukleniyor(false);
      }
    };
    if (kullanici?.rol === 'admin') verileriGetir();
  }, [kullanici]);

  const handleSubmitHaber = async (e) => {
    e.preventDefault();
    setPaylasiliyor(true);
    setMesaj({ tip: '', icerik: '' });

    try {
      if (duzenlemeModu) {
        await axios.put(`/api/haberler/${duzenlenenId}`, haberForm);
        setMesaj({ tip: 'basari', icerik: 'Haber başarıyla güncellendi!' });
      } else {
        await axios.post('/api/admin/haber-paylas', haberForm);
        setMesaj({ tip: 'basari', icerik: 'Haber başarıyla paylaşıldı!' });
      }
      
      setHaberForm({
        baslik: '',
        ozet: '',
        icerik: '',
        resim_url: '',
        kategori_id: '',
        manset: false,
        editorun_sectigi: false
      });
      setDuzenlemeModu(false);
      setDuzenlenenId(null);

      // verileri yenile
      const [istYanit, habYanit] = await Promise.all([
        axios.get('/api/admin/istatistikler'),
        axios.get('/api/haberler')
      ]);
      setIstatistikler(istYanit.data);
      setHaberler(habYanit.data);
    } catch (hata) {
      setMesaj({ tip: 'hata', icerik: 'İşlem sırasında bir hata oluştu.' });
    } finally {
      setPaylasiliyor(false);
    }
  };

  const haberiDuzenle = (haber) => {
    setHaberForm({
      baslik: haber.baslik,
      ozet: haber.ozet,
      icerik: haber.icerik,
      resim_url: haber.resim_url,
      kategori_id: haber.kategori_id,
      manset: haber.manset,
      editorun_sectigi: haber.editorun_sectigi
    });
    setDuzenlemeModu(true);
    setDuzenlenenId(haber.id);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const haberiSil = async (id) => {
    if (!window.confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`/api/haberler/${id}`);
      setHaberler(haberler.filter(h => h.id !== id));
      setMesaj({ tip: 'basari', icerik: 'Haber silindi.' });
    } catch (hata) {
      setMesaj({ tip: 'hata', icerik: 'Silme hatası.' });
    }
  };

  const yaziyiSil = async (id) => {
    if (!window.confirm('Bu köşe yazısını silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`/api/kose-yazilari/${id}`);
      setKoseYazilari(koseYazilari.filter(y => y.id !== id));
      setMesaj({ tip: 'basari', icerik: 'Yazı silindi.' });
    } catch (hata) {
      setMesaj({ tip: 'hata', icerik: 'Silme hatası.' });
    }
  };

  const handleSubmitMedya = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/medya-ekle', medyaForm);
      setMesaj({ tip: 'basari', icerik: 'Medya başarıyla eklendi!' });
      setMedyaForm({ baslik: '', video_id: '' });
      // medyaları yenile
      const yanit = await axios.get('/api/medya');
      setMedyalar(yanit.data);
    } catch (hata) {
      setMesaj({ tip: 'hata', icerik: 'Medya ekleme hatası.' });
    }
  };

  const medyaSil = async (id) => {
    if (!window.confirm('Bu medyayı silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`/api/admin/medya/${id}`);
      setMedyalar(medyalar.filter(m => m.id !== id));
      setMesaj({ tip: 'basari', icerik: 'Medya silindi.' });
    } catch (hata) {
      setMesaj({ tip: 'hata', icerik: 'Medya silme hatası.' });
    }
  };

  if (!kullanici) return <Navigate to="/giris" />;
  if (kullanici.rol !== 'admin') return <Navigate to="/" />;

  if (yukleniyor) return <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>Panel Yükleniyor...</div>;

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      {/* panel başlığı ve navigasyon */}
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Shield size={32} color="var(--accent)" />
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Sistem Yönetim Paneli</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Portal genel durumu ve kullanıcı yönetimi</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>Siteye Dön</Link>
          <button onClick={cikis} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.6rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>Çıkış Yap</button>
        </div>
      </div>

      {/* istatistikler - sadece rakamlar ve ikonlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {[
          { etiket: 'Toplam Haber', deger: istatistikler?.haberler, ikon: <Newspaper size={20} />, renk: '#3b82f6' },
          { etiket: 'Köşe Yazıları', deger: istatistikler?.yazilar, ikon: <FileText size={20} />, renk: '#8b5cf6' },
          { etiket: 'Sistemdeki Yazarlar', deger: istatistikler?.yazarlar, ikon: <Users size={20} />, renk: '#ec4899' },
          { etiket: 'Kayıtlı Üyeler', deger: istatistikler?.kullanicilar, ikon: <Users size={20} />, renk: '#10b981' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ color: item.renk }}>{item.ikon}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>GÜNCEL</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900' }}>{item.deger}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>{item.etiket}</div>
          </motion.div>
        ))}
      </div>

      {/* haber paylaşma/düzenleme formu */}
      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PlusCircle size={24} color="var(--accent)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{duzenlemeModu ? 'Haberi Düzenle' : 'Haber Paylaş'}</h2>
          </div>
          {duzenlemeModu && (
            <button 
              onClick={() => {
                setDuzenlemeModu(false);
                setDuzenlenenId(null);
                setHaberForm({ baslik: '', ozet: '', icerik: '', resim_url: '', kategori_id: '', manset: false, editorun_sectigi: false });
              }}
              style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}
            >
              Vazgeç
            </button>
          )}
        </div>

        {mesaj.icerik && (
          <div style={{ 
            background: mesaj.tip === 'basari' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: mesaj.tip === 'basari' ? '#10b981' : '#ef4444', 
            padding: '1rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {mesaj.icerik}
          </div>
        )}

        <form onSubmit={handleSubmitHaber} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Haber Başlığı</label>
            <input 
              required
              type="text"
              placeholder="Haber başlığını girin..."
              value={haberForm.baslik}
              onChange={(e) => setHaberForm({...haberForm, baslik: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.8rem 1.2rem', borderRadius: '12px', color: 'white' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Kısa Özet</label>
            <input 
              required
              type="text"
              placeholder="Haberi özetleyin..."
              value={haberForm.ozet}
              onChange={(e) => setHaberForm({...haberForm, ozet: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.8rem 1.2rem', borderRadius: '12px', color: 'white' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Kategori</label>
            <select 
              required
              value={haberForm.kategori_id}
              onChange={(e) => setHaberForm({...haberForm, kategori_id: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.8rem 1.2rem', borderRadius: '12px', color: 'white' }}
            >
              <option value="">Kategori Seçin</option>
              {kategoriler.map(kat => (
                <option key={kat.id} value={kat.id} style={{ background: '#111' }}>{kat.isim}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Resim URL</label>
            <input 
              required
              type="text"
              placeholder="Görsel bağlantısını yapıştırın..."
              value={haberForm.resim_url}
              onChange={(e) => setHaberForm({...haberForm, resim_url: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.8rem 1.2rem', borderRadius: '12px', color: 'white' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Haber İçeriği</label>
            <textarea 
              required
              rows="6"
              placeholder="Haber metnini buraya yazın..."
              value={haberForm.icerik}
              onChange={(e) => setHaberForm({...haberForm, icerik: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem 1.2rem', borderRadius: '12px', color: 'white', resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>
              <input 
                type="checkbox" 
                checked={haberForm.manset}
                onChange={(e) => setHaberForm({...haberForm, manset: e.target.checked})}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
              />
              Slider'a (Manşet) Ekle
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>
              <input 
                type="checkbox" 
                checked={haberForm.editorun_sectigi}
                onChange={(e) => setHaberForm({...haberForm, editorun_sectigi: e.target.checked})}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
              />
              Editörün Seçtiklerine Ekle
            </label>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              disabled={paylasiliyor}
              type="submit" 
              style={{ 
                background: 'var(--accent)', 
                color: 'white', 
                padding: '0.8rem 2rem', 
                borderRadius: '100px', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                opacity: paylasiliyor ? 0.7 : 1,
                cursor: paylasiliyor ? 'not-allowed' : 'pointer'
              }}
            >
              {paylasiliyor ? 'İşleniyor...' : <>{duzenlemeModu ? 'Değişiklikleri Kaydet' : <><Send size={18} /> Haberi Yayınla</>}</>}
            </button>
          </div>
        </form>
      </div>

      {/* haber listesi - düzenleme için */}
      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Newspaper size={24} color="var(--accent)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Haberleri Yönet</h2>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {haberler.slice(0, 10).map(haber => (
            <div key={haber.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={haber.resim_url} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{haber.baslik}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{haber.kategori_adi} • {new Date(haber.tarih).toLocaleDateString('tr-TR')}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => haberiDuzenle(haber)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '700' }}
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => haberiSil(haber.id)}
                  style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>En son paylaşılan 10 haber listeleniyor.</p>
        </div>
      </div>

      {/* köşe yazıları yönetimi */}
      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <FileText size={24} color="var(--accent)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Köşe Yazılarını Yönet</h2>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {koseYazilari.slice(0, 10).map(yazi => (
            <div key={yazi.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{yazi.baslik}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{yazi.yazar_adi} • {new Date(yazi.tarih).toLocaleDateString('tr-TR')}</div>
              </div>
              <button 
                onClick={() => yaziyiSil(yazi.id)}
                style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* medya yönetimi */}
      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Film size={24} color="var(--accent)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Press Medya Ekle</h2>
        </div>
        <form onSubmit={handleSubmitMedya} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Video Başlığı</label>
            <input 
              required
              type="text"
              placeholder="Videonun başlığını girin..."
              value={medyaForm.baslik}
              onChange={(e) => setMedyaForm({...medyaForm, baslik: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.8rem 1.2rem', borderRadius: '12px', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>YouTube Video ID</label>
            <div style={{ position: 'relative' }}>
              <Play size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                required
                type="text"
                placeholder="Örn: S5YxZfGj6M8"
                value={medyaForm.video_id}
                onChange={(e) => setMedyaForm({...medyaForm, video_id: e.target.value})}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.8rem 1.2rem 0.8rem 3rem', borderRadius: '12px', color: 'white' }}
              />
            </div>
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ background: '#ef4444', color: 'white', padding: '0.8rem 2rem', borderRadius: '100px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Medya Ekle
            </button>
          </div>
        </form>

        {/* mevcut medyalar listesi */}
        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '1rem' }}>Mevcut Medyalar</h3>
          {medyalar.map(medya => (
            <div key={medya.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem', borderRadius: '8px' }}>
                  <Play size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{medya.baslik}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {medya.video_id}</div>
                </div>
              </div>
              <button 
                onClick={() => medyaSil(medya.id)}
                style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {medyalar.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>Henüz medya eklenmemiş.</p>}
        </div>
      </div>

      {/* kullanıcı listesi - sade tablo */}
      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Üye Yönetimi</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.01)' }}>
                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>KULLANICI</th>
                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>YETKİ</th>
                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>TARİH</th>
              </tr>
            </thead>
            <tbody>
              {kullanicilar.map((kul) => (
                <tr key={kul.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.2rem' }}>
                    <div style={{ fontWeight: '700' }}>{kul.isim}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{kul.eposta}</div>
                  </td>
                  <td style={{ padding: '1.2rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '6px', 
                      fontSize: '0.7rem', 
                      fontWeight: '800',
                      background: kul.rol === 'admin' ? '#3b82f6' : kul.rol === 'yazar' ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}>
                      {kul.rol.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} />
                      {new Date(kul.tarih).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
