# 🏋️‍♂️ FitID Gym App - REST API

REST API backend profesional untuk aplikasi Gym, dikembangkan menggunakan **Express.js** dan **Prisma ORM**. Proyek ini menyediakan berbagai layanan untuk aplikasi fitness modern, mulai dari autentikasi user, membership, artikel, sistem like, komentar, AI form checker, hingga sistem rewards. Dirancang scalable, secure, dan mudah diintegrasikan dengan frontend/mobile.

![CI](https://github.com/bayudani/Rest_api_gym/actions/workflows/ci.yml/badge.svg)

---

## 🚀 Fitur Utama

- **🔐 Autentikasi & Manajemen User**

  - Registrasi user (dengan email verification OTP)
  - Login user
  - Update profil user
  - Ambil data profil dari JWT token
- **📄 Artikel & Komentar**

  - CRUD artikel (fitness, tips, dsb)
  - Ambil artikel by slug/list
  - Komentar pada artikel
  - Like & unlike artikel
  - Hitung jumlah like per artikel
- **💳 Membership & Transaksi**

  - Daftar & manajemen member (premium)
  - Paket membership
  - Pembayaran & histori transaksi (otomatisasi email notifikasi)
  - Status & masa aktif member
- **🎁 Sistem Rewards**

  - Sistem poin member
  - List & detail item rewards
  - Klaim rewards (penukaran poin)
  - Histori rewards member
- **🧠 AI Exercise Form Checker**

  - Analisis postur/gaya latihan user pakai Google Gemini Vision AI
  - Upload gambar, feedback otomatis AI seperti pelatih profesional
- **🏅 Program Latihan**

  - List program latihan
  - Rekomendasi program berdasarkan profil
- **🧩 Integrasi Layanan Lain**

  - Reverse proxy ke backend Laravel (untuk fitur legacy/ekstra)
  - Email notifikasi membership & OTP
- **📘 Dokumentasi API**

  - Swagger UI tersedia di `/api-docs` (otomatis dari source code)

---

## 📊 Endpoint Utama

| Endpoint                   | Method | Auth | Deskripsi Singkat                       |
| -------------------------- | ------ | ---- | --------------------------------------- |
| `/api/auth/register`     | POST   | ❌   | Register user (OTP email)               |
| `/api/auth/login`        | POST   | ❌   | Login user                              |
| `/api/auth/verify`       | POST   | ❌   | Verifikasi kode OTP email               |
| `/api/auth/profile`      | GET    | ✅   | Get data profil user                    |
| `/api/auth/update`       | PUT    | ✅   | Update profil user                      |
| `/api/posts/`            | GET    | ❌   | List artikel                            |
| `/api/posts/:slug`       | GET    | ❌   | Get artikel by slug                     |
| `/api/comment`           | POST   | ✅   | Beri komentar di artikel                |
| `/api/likes/:id`         | POST   | ✅   | Like/unlike artikel                     |
| `/api/memberships/`      | GET    | ✅   | Info membership/daftar paket            |
| `/api/transactions/`     | GET    | ✅   | Histori transaksi membership            |
| `/api/member/rewards/`   | GET    | ✅   | List histori reward member              |
| `/api/item-rewards`      | GET    | ❌   | List semua item rewards                 |
| `/api/item-rewards/:id`  | GET    | ❌   | Detail item reward                      |
| `/api/rewards/:id/claim` | POST   | ✅   | Klaim item reward                       |
| `/api/ai/check-form`     | POST   | ✅   | Upload foto, cek form latihan dengan AI |
| `/api/programs`          | GET    | ❌   | List program latihan                    |

> **Info lengkap endpoint dan skema request/response cek dokumentasi Swagger:**
>
> [Swagger UI - Dokumentasi API](http://localhost:3001/api-docs)

---

## ⚙️ Cara Instalasi & Penggunaan

**1. Clone Repository**

```bash
git clone https://github.com/bayudani/Rest_api_gym.git
cd Rest_api_gym
```

**2. Install Dependencies**

```bash
npm install
```

**3. Setting Environment Variable**

Buat file `.env` di root, isi seperti contoh berikut:

```env
DATABASE_URL=mysql://user:password@localhost:5432/namadb
JWT_SECRET=your_jwt_secret
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourAppPassword
```

**4. Setup Prisma (Database Migration)**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

**5. Jalankan Server**

```bash
npm run dev
```

Server berjalan di: [http://localhost:3001](http://localhost:3001)

Swagger UI: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## 🛠️ Stack & Tools

- **Backend:** Express.js, Node.js
- **ORM:** Prisma
- **Database:** PostgreSQL (default)
- **AI API:** Google Gemini Vision (AI Form Checker)
- **Authentication:** JWT
- **Docs:** Swagger
- **Email:** Nodemailer (OTP, notifikasi membership)
- **Proxy:** http-proxy-middleware (Integrasi Laravel)
- **Logger:** Morgan, custom logger

---

## 📄 Lisensi

MIT License. Lihat file [LICENSE](LICENSE) untuk detail.

---

## 👨‍💻 Author

Bayu Dani - [LinkedIn](https://www.linkedin.com/in/bayu-dani-kurniawan?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
© 2025
