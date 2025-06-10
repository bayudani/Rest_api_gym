import express from 'express';
import { likePost, unlikePost, getLikeCount } from '../controller/like_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';


const router = express.Router();


router.post('/:id/like',authMiddleware, likePost);
router.post('/:id/unlike',authMiddleware, unlikePost);
router.get('/:id/likes', getLikeCount);

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Operasi like/unlike pada post
 */

/**
 * @swagger
 * /api/likes/{id}/like:
 *   post:
 *     summary: Like sebuah post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID post yang ingin di-like
 *     responses:
 *       200:
 *         description: Post berhasil di-like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: User belum login
 *       404:
 *         description: Post tidak ditemukan
 *       409:
 *         description: Post sudah dilike sebelumnya
 */

/**
 * @swagger
 * /api/likes/{id}/unlike:
 *   post:
 *     summary: Unlike sebuah post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID post yang ingin di-unlike
 *     responses:
 *       200:
 *         description: Like berhasil dibatalkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: User belum login
 *       404:
 *         description: Post tidak ditemukan
 *       409:
 *         description: Post belum di-like sebelumnya
 */

/**
 * @swagger
 * /api/likes/{id}/likes:
 *   get:
 *     summary: Ambil jumlah like pada post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID post
 *     responses:
 *       200:
 *         description: Jumlah like berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: integer
 *       404:
 *         description: Post tidak ditemukan
 */
export default router;