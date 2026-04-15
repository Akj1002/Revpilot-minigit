import mongoose from 'mongoose';

const commitSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  parentCommitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commit', default: null },
  message: { type: String, required: true },
  patch: { type: Array, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Commit', commitSchema);