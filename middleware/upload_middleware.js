import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import FormData from 'form-data';

// -------------------------------------------------------------------------
// Dokumentasi File: upload.js
// -------------------------------------------------------------------------
// File ini berisi konfigurasi middleware upload file menggunakan multer,
// untuk mengirim file ke server Laravel (via API) dan untuk analisis AI.
// Semua variabel environment diatur menggunakan dotenv.
//
// Konsep utama:
// - Upload file ke server Laravel via API (menggunakan Ngrok URL)
// - Penyimpanan file di memori (memoryStorage) untuk Vercel (serverless)
// - Validasi file yang diupload (misal: hanya gambar untuk AI, batas ukuran, dsb)
// - Menggunakan asyncHandler untuk error handling yang proper
// - Menggunakan axios dan form-data untuk mengirim file ke Laravel API
// -------------------------------------------------------------------------

dotenv.config(); // Memuat variabel dari .env

// -------------------------------------------------------------------------
// Validasi Variabel Environment
// -------------------------------------------------------------------------

// Ambil URL API Laravel dari variabel environment (.env)
// Contoh .env: LARAVEL_API_URL=https://abc123.ngrok.io/api/upload-proof
const laravelApiUrl = process.env.LARAVEL_API_URL;

// Validasi: Pastikan variabel .env sudah di-set
if (!laravelApiUrl) {
    throw new Error('FATAL ERROR: LARAVEL_API_URL tidak disetel di file .env');
}

// -------------------------------------------------------------------------
// Konfigurasi Upload ke Memori untuk Bukti Transfer (Vercel Compatible)
// -------------------------------------------------------------------------

// Gunakan memoryStorage karena Vercel tidak mendukung disk storage
const proofStorage = multer.memoryStorage();

// Filter: Izinkan hanya file gambar atau PDF untuk bukti transfer
const proofFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar (JPEG/PNG) atau PDF!'), false);
    }
};

// Instance multer untuk upload bukti transfer ke memori
const uploadProofToMemory = multer({
    storage: proofStorage,
    fileFilter: proofFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Maks 10MB untuk bukti transfer
});

// Middleware untuk upload bukti transfer dan kirim ke Laravel API
export const uploadProof = asyncHandler(async (req, res, next) => {
    uploadProofToMemory.single('proof_image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
                console.log('File diterima di Express:', req.file); 

        if (!req.file) {
            return res.status(400).json({ message: 'Bukti transfer wajib diupload.' });
        }

        try {
            // Buat FormData untuk mengirim file ke Laravel
            const formData = new FormData();
            formData.append('file', req.file.buffer, {
                filename: `${req.file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`,
                contentType: req.file.mimetype,
            });

            // Kirim file ke endpoint Laravel via HTTP POST
            const response = await axios.post(laravelApiUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });

            // Simpan informasi file dari response Laravel (misalnya path)
            req.uploadedFile = response.data;
            next();
        } catch (error) {
            console.error('Error uploading to Laravel:', error.message);
            res.status(500).json({ message: 'Gagal mengupload bukti transfer ke server Laravel.' });
        }
    });
});

// -------------------------------------------------------------------------
// Konfigurasi Upload ke Memori untuk Analisis AI (misal: Gemini Vision)
// -------------------------------------------------------------------------

// Gunakan memoryStorage untuk analisis AI
const memoryStorage = multer.memoryStorage();

// Filter: Hanya izinkan file gambar (image/*)
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File yang diupload bukan gambar!'), false);
    }
};

// Instance multer untuk upload ke memori dengan filter & limit ukuran
const memoryUpload = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maks 5MB untuk gambar AI
});

// Middleware upload gambar latihan untuk AI (misal: field 'exerciseImage')
export const uploadExerciseImage = asyncHandler(async (req, res, next) => {
    memoryUpload.single('exerciseImage')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Gambar latihan wajib diupload.' });
        }
        // File disimpan di req.file.buffer untuk diproses AI
        next();
    });
});

// -------------------------------------------------------------------------
// Ringkasan Penggunaan
// -------------------------------------------------------------------------
// - uploadProof: Untuk bukti transfer, file diupload ke memori lalu dikirim ke API Laravel.
//   Contoh pemakaian: router.post('/upload-proof', uploadProof, controller)
// - uploadExerciseImage: Untuk gambar form checker AI, file hanya di memori untuk analisis AI.
//   Contoh pemakaian: router.post('/ai/check-form', uploadExerciseImage, controller)
// -------------------------------------------------------------------------