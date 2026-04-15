import mongoose from 'mongoose';

const repoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'Neural Workspace' },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    language: { type: String, default: 'python' },
    isPrivate: { type: Boolean, default: false },
    
    // 🚀 THE FIX: Tell MongoDB about the branches!
    branches: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch' 
    }],
    defaultBranch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch' 
    }
}, { timestamps: true });

export default mongoose.model('Repo', repoSchema);