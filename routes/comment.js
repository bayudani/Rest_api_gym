import express from "express";

import {
  postCommentBySlug,
  listCommentsByArticleSlug,
  deleteCommentBySlug,
} from "../controller/comment_controller.js";
import authMiddleware from "../middleware/auth_middleware.js";

const router = express.Router();

// Ambil semua komentar berdasarkan slug post
router.get("/article/:slug", listCommentsByArticleSlug);

// Kirim komentar ke post berdasarkan slug
router.post("/article/:slug", authMiddleware, postCommentBySlug);

// Hapus komentar user berdasarkan slug post
router.delete("/article/:slug", authMiddleware, deleteCommentBySlug);
export default router;

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Endpoints untuk komentar pengguna
 */

/**
 * @swagger
 * /comment/article/{slug}:
 *   get:
 *     tags: [Comment]
 *     summary: Ambil komentar berdasarkan slug artikel
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug dari artikel
 *     responses:
 *       200:
 *         description: List komentar
 */

/**
 * @swagger
 * /comment/article/{slug}:
 *   post:
 *     tags: [Comment]
 *     summary: Kirim komentar ke artikel berdasarkan slug
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Artikel yang bagus banget!"
 *     responses:
 *       201:
 *         description: Komentar berhasil dikirim
 */

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     tags: [Comment]
 *     summary: Hapus komentar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Komentar berhasil dihapus
 */
