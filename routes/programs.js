import express from 'express';
import { getProgramsController,getProgramByIdController } from '../controller/programs_controller.js';

const router = express.Router();

// Get all programs
router.get("/", getProgramsController);
// Swagger documentation for get all programs
/**
 * @swagger
 * /programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     responses:
 *       200:
 *         description: Successfully retrieved programs
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
 *                   description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
// Get program by ID
router.get("/:id", getProgramByIdController);
// Swagger documentation for get program by ID
/**
 * @swagger
 * /programs/{id}:
 *   get:
 *     summary: Get program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the program
 *     responses:
 *       200:
 *         description: Successfully retrieved program
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 */
export default router;