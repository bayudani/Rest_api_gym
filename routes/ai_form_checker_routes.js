import express from 'express';
import { checkExerciseForm } from '../controller/ai_form_checker_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';
import { uploadExerciseImage } from '../middleware/upload_middleware.js';

const router = express.Router();

// Terapkan middleware secara berurutan:
// 1. protect: Cek apakah user sudah login
// 2. uploadExerciseImage: Tangani upload file gambar
// 3. checkExerciseForm: Proses logika utama
router.post('/check-form', authMiddleware, uploadExerciseImage, checkExerciseForm);

export default router;
