import express from 'express';
import dotenv from 'dotenv';
import {signup, login, logout, updateProfile} from '../controllers/auth.controller.js';  
import { protectRoute } from '../middleware/auth.middleware.js';

dotenv.config();

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) => {res.status(200).json({ message: 'Authenticated', user: req.user })}); 


export default router;

