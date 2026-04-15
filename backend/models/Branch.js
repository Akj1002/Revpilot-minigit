import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  repositoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
  name: { type: String, required: true },
  latestCommitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commit' },
});

export default mongoose.model('Branch', branchSchema);