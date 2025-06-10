import express from 'express';
import { likePost, unlikePost, getLikeCount } from '../controller/like_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';


const router = express.Router();


router.post('/:id/like',authMiddleware, likePost);
router.post('/:id/unlike',authMiddleware, unlikePost);
router.get('/:id/likes', getLikeCount);
export default router;