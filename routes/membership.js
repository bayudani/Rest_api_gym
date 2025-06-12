import express from 'express';
import { getMemberships, getMembershipByIds } from '../controller/membership_controller.js';

const router = express.Router();
// get all memberships
router.get('/', getMemberships);
// swagger documentation for get all memberships
/**
 * @swagger
 * /memberships:
 *   get:
 *     summary: Get all memberships
 *     tags: [Membership]
 *     responses:
 *       200:
 *         description: Successfully retrieved memberships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   duration:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
// get membership by ID
router.get('/:id', getMembershipByIds);
// swagger documentation for get membership by ID
/**
 * @swagger
 * /memberships/{id}:
 *   get:
 *     summary: Get membership by ID
 *     tags: [Membership]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the membership
 *     responses:
 *       200:
 *         description: Successfully retrieved membership
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 duration:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 */

export default router;