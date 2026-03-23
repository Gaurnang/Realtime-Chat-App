import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    if (req.body !== undefined) {
        return next();
    }

    const contentType = req.headers['content-type'] || '';
    const shouldParseJson = ['POST', 'PUT', 'PATCH'].includes(req.method) && contentType.includes('application/json');

    if (!shouldParseJson) {
        req.body = {};
        return next();
    }

    let rawBody = '';
    req.on('data', (chunk) => {
        rawBody += chunk;
    });

    req.on('end', () => {
        if (!rawBody) {
            req.body = {};
            return next();
        }

        try {
            req.body = JSON.parse(rawBody);
            return next();
        } catch (error) {
            return res.status(400).json({ message: 'Invalid JSON payload!' });
        }
    });
});

app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});