import express from 'express';
import { handleChat,getChatHistory } from '../controller/ai_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

/**
 * @route   POST /api/ai/chat
 * @desc    Endpoint utama untuk interaksi chat dengan AI (teks & audio)
 * @access  Private
 * @middleware
 * - protect: Memastikan user sudah login
 * - upload.single('audio'): Menerima satu file dari form field bernama 'audio'
 */

router.post('/chat', upload.single('audio'), authMiddleware, handleChat);
router.get('/chat/history', authMiddleware, getChatHistory);


export default router;
