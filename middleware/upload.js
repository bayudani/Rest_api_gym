import multer from "multer";
import path from "path";
// import fs form "fs";
import dotenv from "dotenv";

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