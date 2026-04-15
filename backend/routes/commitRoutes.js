import express from 'express';
import { createCommit, getCommitHistory, getBranchState, getStateAtCommit } from '../controllers/commitController.js';
const router = express.Router();
router.post('/', createCommit);
router.get('/:branchId', getCommitHistory);
router.get('/:branchId/state', getBranchState);
router.get('/:branchId/state/:commitId', getStateAtCommit);
export default router;