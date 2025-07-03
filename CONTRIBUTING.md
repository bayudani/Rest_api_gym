# Contributing to FitID Gym App - REST API

Terima kasih telah tertarik untuk berkontribusi pada proyek ini! Kontribusi Anda sangat berarti untuk meningkatkan kualitas dan fitur FitID Gym App REST API. Berikut adalah panduan singkat agar proses kontribusi berjalan lancar.

---

## 📋 Cara Berkontribusi

1. **Fork Repo**
   - Klik tombol `Fork` di pojok kanan atas repositori ini dan buat salinan ke akun GitHub Anda.

2. **Clone Repo**
   - Clone repo hasil fork ke lokal Anda:
     ```bash
     git clone https://github.com/<username-anda>/Rest_api_gym.git
     cd Rest_api_gym
     ```

3. **Buat Branch Fitur/Bugfix**
   - Selalu buat branch baru dari `main` untuk setiap fitur atau perbaikan:
     ```bash
     git checkout -b fitur/nama-fitur-anda
     ```
     atau
     ```bash
     git checkout -b bugfix/nama-bug
     ```

4. **Commit dengan Pesan yang Jelas**
   - Gunakan pesan commit yang deskriptif dan mudah dipahami.
   - Contoh:  
     ```
     feat(auth): tambah endpoint verifikasi OTP
     fix(article): perbaiki bug pada slug generator
     ```

5. **Testing & Linting**
   - Jalankan seluruh test dan pastikan tidak ada error.
   - Pastikan kode sudah di-format dengan baik (`npm run lint` bila tersedia).

6. **Push ke Repo Fork Anda**
   - Push perubahan ke branch di repo fork Anda:
     ```bash
     git push origin fitur/nama-fitur-anda
     ```

7. **Buat Pull Request**
   - Buka tab "Pull Requests" di repo utama.
   - Klik "New Pull Request" dan pilih branch Anda.
   - Jelaskan perubahan yang Anda buat, sertakan context jika perlu.

---

## 📑 Aturan Pull Request

- Satu PR untuk satu fitur/bugfix utama.
- Tambahkan deskripsi PR yang jelas, jelaskan perubahan, langkah testing, dan referensi issue (jika ada).
- Sertakan screenshot/log hasil testing jika relevan.
- Pastikan tidak ada konflik dengan `main` branch.

---

## 🧪 Testing

- Jalankan perintah berikut untuk memastikan semua berjalan dengan baik:
  ```bash
  npm install
  npm run dev
  # atau jika ada:
  npm test
  ```
- Cek dokumentasi API di `/api-docs` (Swagger UI) untuk memastikan endpoint terkait berjalan.

---

## 💬 Diskusi & Bantuan

- Jika ragu atau ingin berdiskusi ide/fitur, silakan buka [issue](https://github.com/bayudani/Rest_api_gym/issues).
- Untuk pertanyaan teknis atau diskusi lebih lanjut, gunakan fitur Discussions (jika tersedia) atau hubungi maintainer.

---

## ❤️ Terima Kasih!

Setiap kontribusi sangat berarti, baik itu kode, dokumentasi, laporan bug, atau saran fitur.  
Selamat berkontribusi!
