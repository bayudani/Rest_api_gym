import express from 'express';
import {
    createTransactionController,
    
    findTransactionByIdController,
    updateTransactionStatusController,
} from '../controller/transaction_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';

const router = express.Router();

// Create a new transaction
router.post('/',authMiddleware, createTransactionController);


export default router;
