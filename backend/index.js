const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { sorgu } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const uygulama = express();
const port = process.env.PORT || 5000;

// güvenlik: cors en üstte olmalı (preflight istekleri için)
uygulama.use(cors({
  origin: 'http://localhost:5173', // geliştirme ortamı
  credentials: true
}));

// güvenlik: genel istek sınırlama (cors'tan sonra)
const genelSinirlayici = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 1000, // geliştirme sürecinde bloklanmamak için artırıldı
  message: { hata: 'Çok fazla istek gönderdiniz, lütfen biraz bekleyin.' }
});

// güvenlik: giriş ve kayıt için daha sıkı sınırlama
const girisSinirlayici = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 20, // deneme sayısını biraz artırdık (hatalı girişler olabilir)
  message: { hata: 'Çok fazla deneme yaptınız, lütfen 1 saat sonra tekrar deneyin.' }
});

uygulama.use(genelSinirlayici);
uygulama.use(helmet({
  crossOriginResourcePolicy: false,
}));
uygulama.use(morgan('dev'));
uygulama.use(express.json({ limit: '10kb' })); // güvenlik: büyük payload saldırılarını önleme

// güvenlik: yetkilendirme middleware
const dogrula = (roller = []) => {
  return (istek, cevap, sonraki) => {
    const token = istek.headers['authorization']?.split(' ')[1];

    if (!token) return cevap.status(401).json({ hata: 'Yetkisiz erişim' });

    try {
      const cozulmus = jwt.verify(token, process.env.JWT_SECRET);
      istek.kullaniciId = cozulmus.id;

      // rol kontrolü (eğer gerekliyse)
      if (roller.length > 0) {
        sorgu('SELECT rol FROM kullanicilar WHERE id = $1', [cozulmus.id]).then(sonuc => {
          if (sonuc.rows.length === 0 || !roller.includes(sonuc.rows[0].rol)) {
            return cevap.status(403).json({ hata: 'Bu işlem için yetkiniz yok' });
          }
          sonraki();
        });
      } else {
        sonraki();
      }
    } catch (hata) {
      return cevap.status(401).json({ hata: 'Geçersiz token' });
    }
  };
};

uygulama.get('/', (istek, cevap) => {
  cevap.json({ mesaj: `Press Haber Portalı API'sine hoş geldiniz.` });
});

// test rotası
uygulama.get('/api/test', (istek, cevap) => {
  cevap.json({ mesaj: 'API çalışıyor' });
});

// kayıt ol
uygulama.post('/api/kayit', girisSinirlayici, async (istek, cevap) => {
  const { isim, eposta, sifre } = istek.body;
  try {
    const kullaniciVarMi = await sorgu('SELECT * FROM kullanicilar WHERE eposta = $1', [eposta]);
    if (kullaniciVarMi.rows.length > 0) {
      return cevap.status(400).json({ hata: 'Bu e-posta adresi zaten kullanımda' });
    }

    const tuz = await bcrypt.genSalt(10);
    const hashliSifre = await bcrypt.hash(sifre, tuz);

    const yeniKullanici = await sorgu(
      'INSERT INTO kullanicilar (isim, eposta, sifre, rol) VALUES ($1, $2, $3, $4) RETURNING id, isim, eposta, rol',
      [isim, eposta, hashliSifre, 'user']
    );

    const token = jwt.sign({ id: yeniKullanici.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    cevap.json({ token, kullanici: yeniKullanici.rows[0] });
  } catch (hata) {
    console.error('kayıt hatası:', hata);
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// giriş yap
uygulama.post('/api/giris', girisSinirlayici, async (istek, cevap) => {
  const { eposta, sifre } = istek.body;
  try {
    const sonuc = await sorgu('SELECT * FROM kullanicilar WHERE eposta = $1', [eposta]);
    if (sonuc.rows.length === 0) {
      return cevap.status(400).json({ hata: 'Geçersiz e-posta veya şifre' });
    }

    const kullanici = sonuc.rows[0];
    const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifre);
    if (!sifreDogruMu) {
      return cevap.status(400).json({ hata: 'Geçersiz e-posta veya şifre' });
    }

    const token = jwt.sign({ id: kullanici.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    cevap.json({
      token,
      kullanici: { id: kullanici.id, isim: kullanici.isim, eposta: kullanici.eposta, rol: kullanici.rol }
    });
  } catch (hata) {
    console.error('giriş hatası:', hata);
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});


// admin istatistikleri
uygulama.get('/api/admin/istatistikler', dogrula(['admin']), async (istek, cevap) => {
  try {
    const haberSayisi = await sorgu('SELECT COUNT(*) FROM haberler');
    const yazarSayisi = await sorgu('SELECT COUNT(*) FROM yazarlar');
    const kullaniciSayisi = await sorgu('SELECT COUNT(*) FROM kullanicilar');
    const yaziSayisi = await sorgu('SELECT COUNT(*) FROM kose_yazilari');

    cevap.json({
      haberler: haberSayisi.rows[0].count,
      yazarlar: yazarSayisi.rows[0].count,
      kullanicilar: kullaniciSayisi.rows[0].count,
      yazilar: yaziSayisi.rows[0].count
    });
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// tüm kullanıcıları getir (admin için)
uygulama.get('/api/admin/kullanicilar', dogrula(['admin']), async (istek, cevap) => {
  try {
    const sonuc = await sorgu('SELECT id, isim, eposta, rol, tarih FROM kullanicilar ORDER BY tarih DESC');
    cevap.json(sonuc.rows);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// köşe yazısı paylaş (yazar ve admin için)
uygulama.post('/api/yazar/yazi-paylas', dogrula(['admin', 'yazar']), async (istek, cevap) => {
  const { baslik, icerik, yazar_id } = istek.body;
  try {
    const sonuc = await sorgu(
      'INSERT INTO kose_yazilari (baslik, icerik, yazar_id) VALUES ($1, $2, $3) RETURNING *',
      [baslik, icerik, yazar_id]
    );
    cevap.json(sonuc.rows[0]);
  } catch (hata) {
    console.error('yazı paylaşma hatası:', hata);
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// haber paylaş (admin için)
uygulama.post('/api/admin/haber-paylas', dogrula(['admin']), async (istek, cevap) => {
  const { baslik, ozet, icerik, resim_url, kategori_id, yazar_id, manset, editorun_sectigi } = istek.body;
  try {
    // slider limit kontrolü (en fazla 5)
    if (manset) {
      const mansetSayisi = await sorgu('SELECT COUNT(*) FROM haberler WHERE manset = true');
      if (parseInt(mansetSayisi.rows[0].count) >= 5) {
        // en eski manşet haberini bul ve manşetten çıkar
        await sorgu(`
          UPDATE haberler SET manset = false 
          WHERE id = (SELECT id FROM haberler WHERE manset = true ORDER BY tarih ASC LIMIT 1)
        `);
      }
    }

    // editörün seçtikleri limit kontrolü (en fazla 4)
    if (editorun_sectigi) {
      const editorSayisi = await sorgu('SELECT COUNT(*) FROM haberler WHERE editorun_sectigi = true');
      if (parseInt(editorSayisi.rows[0].count) >= 4) {
        // en eski editörün seçtiği haberi bul ve listeden çıkar
        await sorgu(`
          UPDATE haberler SET editorun_sectigi = false 
          WHERE id = (SELECT id FROM haberler WHERE editorun_sectigi = true ORDER BY tarih ASC LIMIT 1)
        `);
      }
    }

    const sonuc = await sorgu(
      'INSERT INTO haberler (baslik, ozet, icerik, resim_url, kategori_id, yazar_id, manset, editorun_sectigi) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [baslik, ozet, icerik, resim_url, kategori_id, yazar_id || 1, manset || false, editorun_sectigi || false]
    );
    cevap.json(sonuc.rows[0]);
  } catch (hata) {
    console.error('haber paylaşma hatası:', hata);
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// arama rotası - çakışma olmaması için en üstte
uygulama.get('/api/arama', async (istek, cevap) => {
  const { q } = istek.query;
  if (!q) return cevap.json([]);

  try {
    const sonuc = await sorgu(`
      SELECT h.*, k.isim as kategori_adi, y.isim as yazar_adi, y.profil_resmi as yazar_resmi 
      FROM haberler h
      JOIN kategoriler k ON h.kategori_id = k.id
      JOIN yazarlar y ON h.yazar_id = y.id
      WHERE h.baslik ILIKE $1 OR h.ozet ILIKE $1 OR h.icerik ILIKE $1
      ORDER BY h.tarih DESC
    `, [`%${q}%`]);
    cevap.json(sonuc.rows);
  } catch (hata) {
    console.error('arama hatası:', hata);
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// köşe yazılarını getir
uygulama.get('/api/kose-yazilari', async (istek, cevap) => {
  try {
    const sonuc = await sorgu(`
      SELECT ky.*, y.isim as yazar_adi, y.profil_resmi as yazar_resmi 
      FROM kose_yazilari ky
      JOIN yazarlar y ON ky.yazar_id = y.id
      ORDER BY ky.tarih DESC
    `);
    cevap.json(sonuc.rows);
  } catch (hata) {
    console.error('köşe yazıları getirilirken hata oluştu:', hata);
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// köşe yazısı detayını getir
uygulama.get('/api/kose-yazilari/:id', async (istek, cevap) => {
  const { id } = istek.params;
  try {
    const sonuc = await sorgu(`
      SELECT ky.*, y.isim as yazar_adi, y.profil_resmi as yazar_resmi 
      FROM kose_yazilari ky
      JOIN yazarlar y ON ky.yazar_id = y.id
      WHERE ky.id = $1
    `, [id]);

    if (sonuc.rows.length === 0) {
      return cevap.status(404).json({ hata: 'yazı bulunamadı' });
    }

    cevap.json(sonuc.rows[0]);
  } catch (hata) {
    console.error('köşe yazısı detayı getirilirken hata oluştu:', hata);
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

uygulama.get('/api/haberler', async (istek, cevap) => {
  try {
    const sonuc = await sorgu(`
      SELECT h.*, k.isim as kategori_adi, y.isim as yazar_adi, y.profil_resmi as yazar_resmi 
      FROM haberler h
      JOIN kategoriler k ON h.kategori_id = k.id
      JOIN yazarlar y ON h.yazar_id = y.id
      ORDER BY h.tarih DESC
    `);
    cevap.json(sonuc.rows);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

uygulama.get('/api/haberler/kategori/:slug', async (istek, cevap) => {
  const { slug } = istek.params;
  try {
    const sonuc = await sorgu(`
      SELECT h.*, k.isim as kategori_adi, y.isim as yazar_adi, y.profil_resmi as yazar_resmi 
      FROM haberler h
      JOIN kategoriler k ON h.kategori_id = k.id
      JOIN yazarlar y ON h.yazar_id = y.id
      WHERE k.slug = $1
      ORDER BY h.tarih DESC
    `, [slug]);
    cevap.json(sonuc.rows);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

uygulama.get('/api/haberler/:id', async (istek, cevap) => {
  const { id } = istek.params;
  try {
    const sonuc = await sorgu(`
      SELECT h.*, k.isim as kategori_adi, y.isim as yazar_adi, y.profil_resmi as yazar_resmi 
      FROM haberler h
      JOIN kategoriler k ON h.kategori_id = k.id
      JOIN yazarlar y ON h.yazar_id = y.id
      WHERE h.id = $1
    `, [id]);

    if (sonuc.rows.length === 0) {
      return cevap.status(404).json({ hata: 'haber bulunamadı' });
    }

    await sorgu('UPDATE haberler SET goruntulenme_sayisi = goruntulenme_sayisi + 1 WHERE id = $1', [id]);
    cevap.json(sonuc.rows[0]);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// haber düzenle
uygulama.put('/api/haberler/:id', dogrula(['admin']), async (istek, cevap) => {
  const { id } = istek.params;
  const { baslik, ozet, icerik, resim_url, kategori_id, manset, editorun_sectigi } = istek.body;
  try {
    const sonuc = await sorgu(
      'UPDATE haberler SET baslik = $1, ozet = $2, icerik = $3, resim_url = $4, kategori_id = $5, manset = $6, editorun_sectigi = $7 WHERE id = $8 RETURNING *',
      [baslik, ozet, icerik, resim_url, kategori_id, manset, editorun_sectigi, id]
    );
    if (sonuc.rows.length === 0) return cevap.status(404).json({ hata: 'haber bulunamadı' });
    cevap.json(sonuc.rows[0]);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// köşe yazısı düzenle
uygulama.put('/api/kose-yazilari/:id', dogrula(['admin', 'yazar']), async (istek, cevap) => {
  const { id } = istek.params;
  const { baslik, icerik } = istek.body;
  try {
    const sonuc = await sorgu(
      'UPDATE kose_yazilari SET baslik = $1, icerik = $2 WHERE id = $3 RETURNING *',
      [baslik, icerik, id]
    );
    if (sonuc.rows.length === 0) return cevap.status(404).json({ hata: 'yazı bulunamadı' });
    cevap.json(sonuc.rows[0]);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// yazarın yazılarını getir
uygulama.get('/api/yazar/yazilar/:yazar_id', async (istek, cevap) => {
  const { yazar_id } = istek.params;
  try {
    const sonuc = await sorgu('SELECT * FROM kose_yazilari WHERE yazar_id = $1 ORDER BY tarih DESC', [yazar_id]);
    cevap.json(sonuc.rows);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// haber sil
uygulama.delete('/api/haberler/:id', dogrula(['admin']), async (istek, cevap) => {
  const { id } = istek.params;
  try {
    const sonuc = await sorgu('DELETE FROM haberler WHERE id = $1 RETURNING *', [id]);
    if (sonuc.rows.length === 0) return cevap.status(404).json({ hata: 'haber bulunamadı' });
    cevap.json({ mesaj: 'haber başarıyla silindi' });
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// köşe yazısı sil
uygulama.delete('/api/kose-yazilari/:id', dogrula(['admin', 'yazar']), async (istek, cevap) => {
  const { id } = istek.params;
  try {
    const sonuc = await sorgu('DELETE FROM kose_yazilari WHERE id = $1 RETURNING *', [id]);
    if (sonuc.rows.length === 0) return cevap.status(404).json({ hata: 'yazı bulunamadı' });
    cevap.json({ mesaj: 'yazı başarıyla silindi' });
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// tüm medyaları getir
uygulama.get('/api/medya', async (istek, cevap) => {
  try {
    const sonuc = await sorgu('SELECT * FROM medya ORDER BY tarih DESC');
    cevap.json(sonuc.rows);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// medya ekle
uygulama.post('/api/admin/medya-ekle', dogrula(['admin']), async (istek, cevap) => {
  const { baslik, video_id } = istek.body;
  try {
    const sonuc = await sorgu(
      'INSERT INTO medya (baslik, video_id) VALUES ($1, $2) RETURNING *',
      [baslik, video_id]
    );
    cevap.json(sonuc.rows[0]);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

// medya sil
uygulama.delete('/api/admin/medya/:id', dogrula(['admin']), async (istek, cevap) => {
  const { id } = istek.params;
  try {
    const sonuc = await sorgu('DELETE FROM medya WHERE id = $1 RETURNING *', [id]);
    if (sonuc.rows.length === 0) return cevap.status(404).json({ hata: 'medya bulunamadı' });
    cevap.json({ mesaj: 'medya başarıyla silindi' });
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});

uygulama.get('/api/kategoriler', async (istek, cevap) => {
  try {
    const sonuc = await sorgu('SELECT * FROM kategoriler ORDER BY isim ASC');
    cevap.json(sonuc.rows);
  } catch (hata) {
    cevap.status(500).json({ hata: 'sunucu hatası' });
  }
});


uygulama.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
