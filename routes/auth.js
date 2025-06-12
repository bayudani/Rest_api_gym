import express from 'express';
import { registerUser, login,profile,updateUserInfo, updateUserPassword } from '../controller/auth_controller.js';
import authMiddleware from "../middleware/auth_middleware.js";


const router = express.Router();


router.post('/register', registerUser);

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

router.post('/login', login);

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

router.get('/profile', profile);

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

// swagger update user porfile
router.put("/update", authMiddleware, updateUserInfo);
/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update data profil user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bayu Update
 *               email:
 *                 type: string
 *                 example: bayu_update@example.com
 *     responses:
 *       200:
 *         description: Profil berhasil diupdate
 *       400:
 *         description: Nama dan email wajib diisi
 *       401:
 *         description: Token tidak valid atau tidak ada
 *       500:
 *         description: Gagal update data user
 */

router.put("/update-password", authMiddleware, updateUserPassword);
/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     summary: Ganti password user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: secret123
 *               newPassword:
 *                 type: string
 *                 example: baruBanget123
 *               confirmPassword:
 *                 type: string
 *                 example: baruBanget123
 *     responses:
 *       200:
 *         description: Password berhasil diupdate
 *       400:
 *         description: Password tidak cocok atau field belum lengkap
 *       401:
 *         description: Password lama salah
 *       500:
 *         description: Gagal update password
 */


export default router;