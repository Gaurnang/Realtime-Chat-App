import express from 'express';
import dotenv from 'dotenv';
import { getUsersforSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
dotenv.config();

const router = express.Router();

router.use(protectRoute);

router.get("/users", getUsersforSidebar);
router.get("/:id",  getMessages);
router.post("/send/:id", sendMessage);

export default router;