import express from 'express';
import { handleChat } from '../controller/ai_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';
const router = express.Router();
router.post('/chat', authMiddleware, handleChat);


export default router;
