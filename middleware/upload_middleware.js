import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import asyncHandler from 'express-async-handler'; // Untuk error handling async pada middleware

// -------------------------------------------------------------------------
// Dokumentasi File: upload.js
// -------------------------------------------------------------------------
// File ini berisi konfigurasi middleware upload file menggunakan multer,
// baik untuk penyimpanan ke disk (misal: upload bukti transfer ke folder Laravel)
// maupun upload file ke memori (misal: upload gambar untuk analisis AI).
// Semua variabel environment diatur menggunakan dotenv.
//
// Konsep utama:
// - Penyimpanan file ke disk (diskStorage) untuk bukti transfer
// - Penyimpanan file di memori (memoryStorage) untuk keperluan AI (Gemini Vision)
// - Validasi file yang diupload (misal: hanya gambar, batas ukuran, dsb)
// - Menggunakan asyncHandler agar middleware multer bisa menangani error secara proper
// -------------------------------------------------------------------------

dotenv.config(); // Memuat variabel dari .env

// -------------------------------------------------------------------------
// Konfigurasi Storage Disk untuk Bukti Transfer
// -------------------------------------------------------------------------

// Ambil path absolut dari variabel environment (.env)
// Contoh .env: LARAVEL_STORAGE_PATH=/absolute/path/to/laravel/storage/app/public
const laravelStoragePath = process.env.LARAVEL_STORAGE_PATH;

// Validasi: Pastikan variabel .env sudah di-set
if (!laravelStoragePath) {
    throw new Error("FATAL ERROR: LARAVEL_STORAGE_PATH tidak disetel di file .env");
}

// -------------------------------------------------------------------------
// (Opsional) Fungsi helper untuk pastikan direktori tujuan upload sudah ada.
// Biasanya pakai fs.mkdirSync, bisa diaktifkan jika dibutuhkan.
// -------------------------------------------------------------------------
/*
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};
*/

// -------------------------------------------------------------------------
// Konfigurasi multer.diskStorage untuk upload bukti transfer (DISK STORAGE)
// -------------------------------------------------------------------------
const proofStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lokasi folder tujuan, disesuaikan dari .env
        const dest = path.join(laravelStoragePath, 'bukti-transfer');
        // ensureDirectoryExistence(dest + '/'); // Aktifkan jika ingin pastikan folder selalu ada
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        // Penamaan file: [nama field]-[timestamp]-[random].[ext]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Middleware untuk upload bukti transfer ke disk
export const uploadProof = multer({ storage: proofStorage });

// ==========================================================================
// Konfigurasi Upload ke Memori (untuk Analisis AI, misal: Gemini Vision)
// ==========================================================================

// Gunakan memoryStorage, file TIDAK ditulis ke disk, hanya di RAM sementara
const memoryStorage = multer.memoryStorage();

// Filter: Hanya izinkan file gambar (image/*)
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File yang diupload bukan gambar!'), false);
    }
};

// Instance multer untuk upload ke memory dengan filter & limit ukuran
const memoryUpload = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Maks 5MB
});

// Middleware upload gambar latihan untuk AI (misal: field 'exerciseImage')
// Menggunakan asyncHandler agar error dari multer bisa ditangani Express
export const uploadExerciseImage = asyncHandler(async (req, res, next) => {
    // Proses upload single file dengan field name 'exerciseImage'
    memoryUpload.single('exerciseImage')(req, res, (err) => {
        if (err) {
            // Error dari multer (ukuran, filter, dsb)
            return res.status(400).json({ message: err.message });
        }
        // Validasi: file wajib ada
        if (!req.file) {
            return res.status(400).json({ message: 'Gambar latihan wajib diupload.' });
        }
        // Lanjut ke controller berikutnya kalau sukses
        next();
    });
});

// -------------------------------------------------------------------------
// Ringkasan Penggunaan
// -------------------------------------------------------------------------
// - uploadProof: Untuk bukti transfer, file disimpan ke disk di Laravel.
//   Contoh pemakaian: router.post('/upload-proof', uploadProof.single('proof'), ...)
// - uploadExerciseImage: Untuk gambar form checker AI, file hanya di memori.
//   Contoh pemakaian: router.post('/ai/check-form', uploadExerciseImage, ...)
// -------------------------------------------------------------------------