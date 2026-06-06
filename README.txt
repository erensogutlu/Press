/* Press – Haber Portalı */

Press, gerçek zamanlı haber akışı, zengin köşe yazıları, interaktif video medya içerikleri ve gelişmiş rol tabanlı yönetim panelleri ile donatılmış, modern ve kullanıcı odaklı bir haber platformudur.

* Özellikler : 

 -> Rol Tabanlı Yönetim: Admin ve Yazar panelleri ile içerik yönetimi, istatistik takibi ve kullanıcı kontrolü.
 -> Gerçek Zamanlı Bildirimler: Yeni eklenen haberler için anlık görsel bildirimler ve bildirim merkezi.
 -> Press Medya: YouTube entegrasyonlu, dinamik ve yönetilebilir video galeri alanı.
 -> Gelişmiş Arama & Filtreleme: Haberler arasında anlık arama ve kategori bazlı dinamik listeleme.
 -> Güvenlik Odaklı Mimari: JWT, Bcrypt, Express Rate Limit ve Helmet ile halka açık yayına hazır altyapı.
 -> Modern UI/UX: Glassmorphism efektleri, responsive tasarım ve premium karanlık tema odaklı arayüz.
 -> SEO Dostu: Dinamik sayfa başlıkları, meta açıklamaları ve semantik HTML yapısı.

* Kullanılan Teknolojiler :

    Frontend : 

   -> React.js (Vite)
   -> Vanilla CSS (Modern & Glassmorphism)
   -> Lucide React (İkon Seti)
   -> Framer Motion (Animasyonlar)
   -> Axios (API İletişimi)

    Backend :

   -> Node.js (Express)
   -> PostgreSQL (Aiven Cloud)
   -> JWT & BcryptJS (Güvenlik)
   -> Helmet & Express Rate Limit (Zırhlı API)

* Geliştirici : Eren Söğütlü

-----------------------------------------------------------------------------------------------------------------

/* Press – News Portal */

Press is a modern and user-oriented news platform equipped with real-time news feeds, rich column articles, interactive video media content, and advanced role-based management panels.

* Features : 

 -> Role-Based Management: Content management, statistics tracking, and user control with Admin and Author panels.
 -> Real-Time Notifications: Instant visual notifications and notification center for newly added news.
 -> Press Media: Dynamic and manageable video gallery area with YouTube integration.
 -> Advanced Search & Filtering: Instant search among news and dynamic listing based on categories.
 -> Security-Oriented Architecture: Public-ready infrastructure with JWT, Bcrypt, Express Rate Limit, and Helmet.
 -> Modern UI/UX: Premium interface with Glassmorphism effects, responsive design, and dark theme focus.
 -> SEO Friendly: Dynamic page titles, meta descriptions, and semantic HTML structure.

* Technologies Used : 

    Frontend : 

   -> React.js (Vite)
   -> Vanilla CSS (Modern & Glassmorphism)
   -> Lucide React
   -> Framer Motion
   -> Axios

    Backend : 

   -> Node.js (Express)
   -> PostgreSQL (Aiven Cloud)
   -> JWT & BcryptJS
   -> Helmet & Express Rate Limit

* Developer : Eren Söğütlü

-----------------------------------------------------------------------------------------------------------------

## Kurulum ve Çalıştırma

### 1. Gerekli Paketlerin Yüklenmesi

Frontend için:

```bash
cd frontend
npm install
```

Backend için:

```bash
cd backend
npm install
```

---

### 2. Çevre Değişkenleri Ayarları (.env)

Backend tarafında `backend` dizininde `.env` dosyasını oluşturup bilgileri girin:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 3. Projeyi Çalıştırma

Kurulum tamamlandıktan sonra iki ayrı terminal kullanın:

#### Backend (Sunucu)

```bash
cd backend
node index.js
```

> Sunucu: http://localhost:5000

---

#### Frontend (İstemci)

```bash
cd frontend
npm run dev
```

> Uygulama: http://localhost:5173

-----------------------------------------------------------------------------------------------------------------

## Installation and Operation

### 1. Installing Required Packages

For frontend:

```bash
cd frontend
npm install
```

For backend:

```bash
cd backend
npm install
```

---

### 2. Environment Variables Settings (.env)

Create an `.env` file in the `backend` directory and fill in the contents:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 3. Running the Project

Once the installation is complete, use two separate terminals:

#### Backend

```bash
cd backend
node index.js
```

> Server: http://localhost:5000

---

#### Frontend

```bash
cd frontend
npm run dev
```

> Application: http://localhost:5173