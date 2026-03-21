import express from 'express';
import dotenv from 'dotenv';
import {signup, login, logout, updateProfie} from '../controllers/auth.controller.js';  
import { protectRoute } from '../middlware/auth.middlewate.js';

dotenv.config();

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post("/update-profile", protectRoute, updateProfie);

router.get("/check", protectRoute, (req, res) => {res.status(200).json({ message: 'Authenticated', user: req.user })}); 


export default router;

