import express from "express";
import {getMemberProfile} from "../controller/member_controller.js";
import authMiddleware from '../middleware/auth_middleware.js';

const router = express.Router();

// Get member profile
router.get("/profile", authMiddleware, getMemberProfile);

export default router;
