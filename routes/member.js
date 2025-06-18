import express from "express";
import {getMemberProfile,getMemberPoint,getMyAttends} from "../controller/member_controller.js";
import authMiddleware from '../middleware/auth_middleware.js';

const router = express.Router();

// Get member profile
router.get("/profile", authMiddleware, getMemberProfile);
//  swagger documentation for get member profile
/**
 * @swagger
 * /member/profile:
 *   get:
 *     summary: Get member profile
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved member profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 membership_status:
 *                   type: string
 */

// Get member point
router.get("/point", authMiddleware,getMemberPoint);
//  swagger documentation for get member point
/**
 * @swagger
 * /member/point:
 *   get:
 *     summary: Get member point
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved member point
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 point:
 *                   type: integer
 */

router.get("/attends/me", authMiddleware, getMyAttends); // 💥 here we go
//  swagger documentation for get member attends
/**
 * @swagger
 * /member/attends/me:
 *   get:
 *     summary: Get member attends
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved member attends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attends:
 *                   type: array
 *                   items:
 *                     type: object
 */
export default router;
