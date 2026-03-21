import cloudinary from '../lib/cloudinary.js';
import Message from '../models/message.js';
import Users from '../models/User.js';

export const getAllContacts = async(req, res) => {
    try {
        
        const loggedInUserId = req.user._id;
        const filterUsers = await Users.find({_id : { $ne : loggedInUserId }}).select("-password");

        res.status(200).json(filterUsers);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChatPartners = async (req, res) => {
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

export const getMessagesWithUserId = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { id: userToChatWith } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: userToChatWith },
                { senderId: userToChatWith, receiverId: loggedInUserId }
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
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { content, image } = req.body;

        if (!content && !image) {
            return res.status(400).json({ message: 'Message content or image is required!' });
        }

        let imageUrl = null;

        if(image) {
            //Upload image to cloudinary and get the URL
            imageUrl = await cloudinary.uploader.upload(image);
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            content: content || '',
            image: imageUrl ? imageUrl.secure_url : null
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } 
    
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};