import express from 'express';
import { 
    initRepo, 
    getAllRepos, 
    getRepoById, 
    executeCode, 
    pushCommit, 
    renameRepo,
    deleteRepo 
} from '../controllers/repoController.js';

const router = express.Router();

router.post('/init', initRepo);
router.post('/execute', executeCode);
router.post('/:repoId/push', pushCommit);
router.put('/:id', renameRepo);
router.delete('/:id', deleteRepo); // <-- The new DELETE route

router.get('/user/:ownerId', getAllRepos);
router.get('/:id', getRepoById);

export default router;