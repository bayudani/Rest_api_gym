# 🏋️‍♂️ Gym App - REST API

 REST API backend untuk aplikasi Gym, dibuat menggunakan **Express.js** dan **Prisma ORM**. API ini mendukung fitur user auth, artikel seputar gym, sistem like/unlike artikel, dan komentar

---

## 🚀 Fitur Utama

- 🔐 Autentikasi user (Login)
- 📄 Artikel seputar fitness (GET by slug / list)
- 👍 Like & Unlike artikel
- 📊 Hitung jumlah like
- 📘 Dokumentasi API pakai Swagger

---

## ⚙️ Cara Install

1. **Clone repo**

```bash
git clone https://github.com/namalo/gym-api.git
cd gym-api

```

    2.**Install dependencies**

```
npm install
```

3. **Setup environment variables**

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/namadb
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```
4. **Setup prisma**

   ```
   npx prisma migrate dev --name init
   npx prisma generate
   ```
