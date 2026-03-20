import Users from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {

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
    const {email, password} = req.body;
    
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

