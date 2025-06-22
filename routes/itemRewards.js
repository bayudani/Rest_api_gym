import express from 'express';
import { getAllItemRewardss,getItemRewardByIdd } from '../controller/itemRewards_controller.js';

const router = express.Router();
// Route untuk mengambil semua item rewards
router.get('/', getAllItemRewardss);
//  swagger documentation
/**
 * @swagger
 * /api/item-rewards:
 *   get:
 *     summary: Mengambil semua item rewards
 *     tags: [Item Rewards]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua item rewards
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
// Route untuk mengambil item reward berdasarkan ID
router.get('/:id', getItemRewardByIdd);
//  swagger documentation
/** * @swagger
 * /api/item-rewards/{id}:
 *   get:
 *     summary: Mengambil item reward berdasarkan ID
 *     tags: [Item Rewards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari item reward yang ingin diambil
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengambil item reward
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
export default router;