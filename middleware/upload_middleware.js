import multer from "multer";
import path from "path";
// import fs form "fs";
import dotenv from "dotenv";
import asyncHandler from 'express-async-handler'; // <-- FIX #2: Tambahkan import 'express-async-handler'


dotenv.config(); // Panggil ini untuk memuat variabel dari .env

// --- INI DIA PERUBAHANNYA ---
// Ambil path absolut dari environment variable
const laravelStoragePath = process.env.LARAVEL_STORAGE_PATH;

// Tambahkan pengecekan untuk memastikan variabel .env ada
if (!laravelStoragePath) {
    throw new Error("FATAL ERROR: LARAVEL_STORAGE_PATH tidak disetel di file .env");
}

// Fungsi untuk memastikan direktori ada, jika tidak, maka dibuat
// (Fungsi ini tetap sama)
const ensureDirectoryExistence = (filePath) => {
    // ... (tidak ada perubahan di fungsi ini)
};

// Konfigurasi penyimpanan untuk bukti transaksi
const proofStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // --- Path destinasinya sekarang menggunakan variabel dari .env ---
        const dest = path.join(laravelStoragePath, 'bukti-transfer');
        ensureDirectoryExistence(dest + '/');
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        // ... (tidak ada perubahan di sini)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Middleware multer (tetap sama)
export const uploadProof = multer({ storage: proofStorage });

// ===================================================================
// >> BAGIAN 2: UNTUK MENGOLAH FILE DI MEMORI (AI Form Checker)
// ===================================================================

// Konfigurasi untuk menyimpan file di memori sementara
const memoryStorage = multer.memoryStorage();

// Filter untuk memastikan hanya file gambar yang diterima
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File yang diupload bukan gambar!'), false);
    }
};

// Instance multer yang menggunakan memory storage
const memoryUpload = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Batas ukuran file 5 MB
});

// Middleware untuk upload gambar latihan (YANG INI UNTUK AI)
// Kita bungkus dengan asyncHandler untuk error handling yang lebih baik
export const uploadExerciseImage = asyncHandler(async (req, res, next) => {
    // Jalankan multer untuk satu file dengan nama field 'exerciseImage'
    memoryUpload.single('exerciseImage')(req, res, (err) => {
        if (err) {
            // Menangani error dari multer (misal: file terlalu besar, bukan gambar)
            return res.status(400).json({ message: err.message });
        }
        // Jika tidak ada file yang diupload sama sekali
        if (!req.file) {
            return res.status(400).json({ message: 'Gambar latihan wajib diupload.' });
        }
        // Jika semua aman, lanjut ke controller berikutnya
        next();
    });
});