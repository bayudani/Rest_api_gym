import express from 'express';
import { registerUser, login,profile } from '../controller/auth_controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/profile', profile);

export default router;