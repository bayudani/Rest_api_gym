import express from 'express';
import {
    createTransactionController,
    
    findTransactionByIdController,
    updateTransactionStatusController,
} from '../controller/transaction_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';
import {uploadProof} from '../middleware/upload_middleware.js';
const router = express.Router();

// Create a new transaction
router.post('/',authMiddleware, uploadProof.single('proof_image'),createTransactionController);
// swagger documentation for create transaction
/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               program_id:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Successfully created transaction
 */

router.patch('/:id/status', updateTransactionStatusController);

export default router;
