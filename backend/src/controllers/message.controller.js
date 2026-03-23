import cloudinary from '../lib/cloudinary.js';
import Message from '../models/message.js';
import Users from '../models/User.js';

export const getUsersforSidebar = async(req, res) => {
    try {
        
        const loggedInUserId = req.user._id;
        const filterUsers = await Users.find({_id : { $ne : loggedInUserId }}).select("-password");

        res.status(200).json(filterUsers);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessagesWithUserId = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
        }).select('senderId receiverId');

        const chatPartnerIds = messages.map(msg => {
            if(msg.senderId.toString() === loggedInUserId.toString()) {
                return msg.receiverId;
            }
            return msg.senderId;
        })
        const partnerIds = [...new Set(chatPartnerIds.map(id => id.toString()))];

        const chatPartners = await Users.find({ _id: { $in: partnerIds } }).select('-password');

        res.status(200).json(chatPartners);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id : UsertoChatId} = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId, receiverId: UsertoChatId },
                { senderId: UsertoChatId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const { text, image } = req.body;

        let imageUrl = null;

        if(image) {
            const uploadResult = await cloudinary.uploader.upload(image);
            imageUrl = uploadResult.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            content: text,
            image: imageUrl
        });
        await newMessage.save();

        res.status(201).json(newMessage);
    } 
    catch(error) {
        res.status(500).json({ message: error.message });
    }
};