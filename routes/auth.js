import express from 'express';
import { registerUser, login,profile } from '../controller/auth_controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/profile', profile);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints untuk otentikasi pengguna
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bro Bayu
 *               email:
 *                 type: string
 *                 example: bayu@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Field belum lengkap
 *       409:
 *         description: Email sudah terdaftar
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: bayu@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Email/password kosong
 *       401:
 *         description: Email/password salah
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get data user dari token JWT
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sukses ambil profile
 *       401:
 *         description: Token tidak valid atau tidak ada
 *       404:
 *         description: User tidak ditemukan
 */


export default router;