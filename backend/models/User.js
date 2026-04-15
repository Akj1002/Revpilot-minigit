import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    
    avatar: { type: String, default: "" },
    authProvider: { 
        type: String, 
        enum: ['local', 'google', 'github'], 
        default: 'local' 
    }
}, { timestamps: true });
userSchema.pre('save', async function(next) {
    if (!this.password || !this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('User', userSchema);