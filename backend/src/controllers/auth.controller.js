import Users from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body || {};

        if(!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full name, email and password are required!' });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long!' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format!' });
        }
        
        const user = await Users.findOne({ email });

        if(user) {
            return res.status(400).json({ message: 'Email already exists!' });
        }
        
       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new Users({
            fullName,
            email,
            password: hashedPassword
        })

        
        if(newUser) {
            const token = generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id, 
                email: newUser.email, 
                fullName: newUser.fullName, 
                profilePicture: newUser.profilePicture,
                createdAt: newUser.createdAt,
                token: token
            });
        }

        else {
            return res.status(400).json({ message: 'Error creating user!' });
        }

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error!' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body || {};
    
    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password are required!' });
    }

    if(password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long!' });
    }

    try {
        const user = await Users.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const isPassWordCorrect = await bcrypt.compare(password, user.password);

        if(!isPassWordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }
        
        const token = generateToken(user._id, res);

        res.json({
            _id: user._id, 
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }   
}

export const logout = (req, res) => {
    res.cookie('jwt', "", {maxAge: 0});
    res.status(200).json({ message: 'Logout successful!' });
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePicture} = req.body;

        if(!profilePicture) {
            return res.status(400).json({ message: 'Profile picture is required!' });
        }

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePicture);

        const updatedUser = await Users.findByIdAndUpdate(userId, { profilePicture : uploadResponse.secure_url }, { new: true }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
}

