import express from 'express';
import { handleChat,getChatHistory } from '../controller/ai_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';
const router = express.Router();
router.post('/chat', authMiddleware, handleChat);
router.get('/chat/history', authMiddleware, getChatHistory);


export default router;
