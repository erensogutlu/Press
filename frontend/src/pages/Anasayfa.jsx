import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HaberKarti from '../components/HaberKarti';
import MansetSlider from '../components/MansetSlider';
import PiyasaBandi from '../components/PiyasaBandi';
import YazarBolumu from '../components/YazarBolumu';
import EditorunSectikleri from '../components/EditorunSectikleri';
import PressMedya from '../components/PressMedya';
import Bildirim from '../components/Bildirim';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Anasayfa = () => {
  const [haberler, setHaberler] = useState([]);
  const [koseYazilari, setKoseYazilari] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yeniHaberBildirimi, setYeniHaberBildirimi] = useState(null);
  const { kullanici } = useAuth();
  const oncekiHaberSayisi = useRef(0);

  useEffect(() => {
    const verileriGetir = async (ilkYukleme = false) => {
      try {
        const [haberYaniti, koseYaniti] = await Promise.all([
          axios.get('/api/haberler'),
          axios.get('/api/kose-yazilari')
        ]);
        
        // eğer yeni haber varsa ve giriş yapılmışsa bildirim göster
        if (!ilkYukleme && kullanici && haberYaniti.data.length > oncekiHaberSayisi.current) {
          setYeniHaberBildirimi(haberYaniti.data[0]);
        }
        
        setHaberler(haberYaniti.data);
        setKoseYazilari(koseYaniti.data.slice(0, 3));
        oncekiHaberSayisi.current = haberYaniti.data.length;
      } catch (hata) {
        console.error('veriler yüklenemedi:', hata);
      } finally {
        if (ilkYukleme) setYukleniyor(false);
      }
    };

    verileriGetir(true);

    // her 10 saniyede bir yeni haber kontrolü
    const interval = setInterval(() => {
      if (kullanici) verileriGetir();
    }, 10000);

    return () => clearInterval(interval);
  }, [kullanici]);

  if (yukleniyor) {
    return (
      <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="yukleme-cubugu"></div>
      </div>
    );
  }

  const sliderHaberleri = haberler.filter(h => h.manset).sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
  const editorunSectikleri = haberler.filter(h => h.editorun_sectigi).sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
  
  // eğer hiç manşet veya editör seçimi yoksa (eski veriler için) fallback yapalım
  const finalSlider = sliderHaberleri.length > 0 ? sliderHaberleri : haberler.slice(0, 5);
  const finalEditor = editorunSectikleri.length > 0 ? editorunSectikleri : haberler.slice(5, 9);
  
  // diğer haberler: ne manşette ne de editör seçiminde olanlar
  const digerHaberler = haberler.filter(h => 
    !finalSlider.find(s => s.id === h.id) && 
    !finalEditor.find(e => e.id === h.id)
  );

  return (
    <>
      <PiyasaBandi />
      <div className="container" style={{ paddingTop: '2rem' }}>
        {yeniHaberBildirimi && <Bildirim key={yeniHaberBildirimi.id} haber={yeniHaberBildirimi} />}

        {/* manşet slider bölümü */}
        {finalSlider.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MansetSlider haberler={finalSlider} />
          </motion.div>
        )}

        {/* başlık */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>SON HABERLER</h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        {/* haber ızgarası */}
        <div className="haber-izgarasi" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {digerHaberler.map((haber, indeks) => (
            <motion.div 
              key={haber.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: indeks * 0.1 }}
            >
              <HaberKarti haber={haber} />
            </motion.div>
          ))}
        </div>

        {/* editörün seçtikleri */}
        {finalEditor.length > 0 && (
          <EditorunSectikleri haberler={finalEditor} />
        )}

        {/* yazar ve köşe yazıları bölümü */}
        {koseYazilari.length > 0 && (
          <YazarBolumu yazilar={koseYazilari} />
        )}

        {/* press medya bölümü */}
        <PressMedya />

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
    </>
  );
};

export default Anasayfa;
