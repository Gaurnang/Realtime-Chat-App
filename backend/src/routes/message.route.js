import express from 'express';
import dotenv from 'dotenv';
import { getAllContacts, getChatPartners, getMessagesWithUserId, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

dotenv.config();

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesWithUserId);
router.post("/send/:id", sendMessage);

export default router;