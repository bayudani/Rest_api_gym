import express from 'express';
import { likePost, unlikePost, getLikeCount } from '../controller/like_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';


const router = express.Router();


router.post('/:slug/like', authMiddleware, likePost);
router.post('/:slug/unlike', authMiddleware, unlikePost);
router.get('/:slug/likes', getLikeCount);

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Operasi like/unlike pada artikel/post
 */

/**
 * @swagger
 * /api/likes/{slug}/like:
 *   post:
 *     summary: Like sebuah artikel
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug dari artikel yang ingin di-like
 *     responses:
 *       200:
 *         description: Artikel berhasil di-like
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
 *         description: Artikel tidak ditemukan
 *       409:
 *         description: Artikel sudah di-like sebelumnya
 */

/**
 * @swagger
 * /api/likes/{slug}/unlike:
 *   post:
 *     summary: Unlike sebuah artikel
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug dari artikel yang ingin di-unlike
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
 *         description: Artikel tidak ditemukan
 *       409:
 *         description: Artikel belum di-like sebelumnya
 */

/**
 * @swagger
 * /api/likes/{slug}/likes:
 *   get:
 *     summary: Ambil jumlah like pada artikel
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug dari artikel
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
 *         description: Artikel tidak ditemukan
 */

export default router;