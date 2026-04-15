import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch'; // Ensure node-fetch is installed or use global fetch (Node 18+)

// --- IMPORT MODELS & ROUTES ---
import User from './models/User.js';
import repoRoutes from './routes/repoRoutes.js';
import commitRoutes from './routes/commitRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 🛠️ MIDDLEWARE ---
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'] // 🛡️ Added Authorization for JWT
}));
app.use(express.json());

// ==========================================
// 🔐 GOOGLE OAUTH + MONGODB ROUTE
// ==========================================
app.post('/api/auth/google', async (req, res) => {
    const { credential } = req.body; 
    
    try {
        // 1. Fetch user profile from Google using the Access Token (ya29...)
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { 'Authorization': `Bearer ${credential}` }
        });
        
        if (!googleResponse.ok) throw new Error('Failed to fetch user info from Google');
        const payload = await googleResponse.json();
        
        // 2. READ/CREATE User in MongoDB
        let user = await User.findOne({ email: payload.email });

        if (!user) {
            user = await User.create({
                username: payload.name,
                email: payload.email,
                avatar: payload.picture,
                authProvider: 'google' 
            });
            console.log(`✨ New user saved: ${user.username}`);
        }

        // 3. Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET || 'revbase_secret_key', 
            { expiresIn: '7d' }
        );
        
        res.status(200).json({ 
            message: 'Google login successful', 
            user: { id: user._id, name: user.username, email: user.email, picture: user.avatar },
            token 
        });

    } catch (error) {
        console.error('❌ Google Auth Error:', error.message);
        res.status(401).json({ message: 'Authentication failed' });
    }
});

// ==========================================
// 📧 EMAIL OTP ROUTES
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

const otpStore = {};

app.post('/api/auth/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'RevBase Security Code',
        html: `<div style="font-family:sans-serif; padding:20px; background:#0d1117; color:#fff; border-radius:10px;">
                <h2 style="color:#58a6ff;">RevBase Neural Engine</h2>
                <p>Your verification code is:</p>
                <h1 style="background:#161b22; padding:10px; display:inline-block; color:#3fb950; border-radius:5px;">${otp}</h1>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
        res.status(500).json({ message: 'Email failed' });
    }
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otpStore[email] === otp) {
        delete otpStore[email]; 
        res.status(200).json({ message: 'Verified' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

// ==========================================
// 🛰️ API ROUTES
// ==========================================
app.use('/api/repos', repoRoutes);
app.use('/api/commits', commitRoutes);

// ==========================================
// 📂 DB CONNECTION & START
// ==========================================
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/revbase_db")
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err.message));

app.listen(PORT, () => {
    console.log(`\n🚀 Server: http://localhost:${PORT}`);
    console.log(`🌐 API: http://localhost:${PORT}/api/repos/init\n`);
});