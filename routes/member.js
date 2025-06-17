import express from "express";
import {getMemberProfile} from "../controller/member_controller.js";
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
export default router;
