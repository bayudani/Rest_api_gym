import express from 'express';
import { getMemberRewardHistory } from '../controller/rewards_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';
const router = express.Router();

router.get('/history', authMiddleware, getMemberRewardHistory);
export default router;