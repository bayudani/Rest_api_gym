import express from 'express';
import { getMemberRewardHistory,claimMemberReward } from '../controller/rewards_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';
const router = express.Router();

// swagger documentation
/**
 * @swagger
 * tags:
 *   name: Rewards
 *   description: API untuk mengelola reward member
 */
// @route   GET /api/rewards/history
// @desc    Mengambil histori reward member yang sedang login 
router.get('/history', authMiddleware, getMemberRewardHistory);
//  swagger documentation
/**
 * @swagger
 * /api/rewards/{id}/claim:
 *   post:
 *     summary: Klaim reward berdasarkan ID
 *     tags: [Rewards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari item reward yang ingin diklaim
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Reward berhasil diklaim
 *       400:
 *         description: Poin tidak cukup atau kesalahan lainnya
 *       404:
 *         description: Item reward tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
// @route   POST /api/rewards/:id/claim
// @desc    Member mengklaim sebuah item reward berdasarkan ID item
// @access  Private
router.post('/:id/claim', authMiddleware, claimMemberReward);

//  swagger documentation
/**
 * @swagger
 * /api/rewards/history:
 *   get:
 *     summary: Mengambil histori reward member yang sedang login
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil histori reward
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
export default router;