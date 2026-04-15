import jsonpatch from 'fast-json-patch';
const { compare, applyPatch } = jsonpatch;
import Commit from '../models/Commit.js';
import Branch from '../models/Branch.js';

async function reconstructState(branchId) {
    const commits = await Commit.find({ branchId }).sort({ createdAt: 1 });
    let currentState = {};
    for (const commit of commits) {
        applyPatch(currentState, commit.patch); 
    }
    return currentState;
}

export const createCommit = async (req, res) => {
    try {
        const { branchId, message, incomingData } = req.body;
        const branch = await Branch.findById(branchId);
        
        const currentState = await reconstructState(branchId);
        const patch = compare(currentState, incomingData);

        if (patch.length === 0) return res.status(400).json({ error: "No changes detected." });

        const newCommit = new Commit({
            branchId,
            parentCommitId: branch.latestCommitId,
            message,
            patch
        });

        await newCommit.save();
        branch.latestCommitId = newCommit._id;
        await branch.save();

        res.status(201).json({ message: "Commit successful" });
    } catch (error) {
        res.status(500).json({ error: "Failed to process commit" });
    }
};

export const getCommitHistory = async (req, res) => {
    try {
        const commits = await Commit.find({ branchId: req.params.branchId }).sort({ createdAt: -1 }).select('message patch createdAt');
        res.status(200).json(commits);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
};

export const getBranchState = async (req, res) => {
    try {
        const currentState = await reconstructState(req.params.branchId);
        res.status(200).json(currentState);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch branch state" });
    }
};

export const getStateAtCommit = async (req, res) => {
    try {
        const { branchId, commitId } = req.params;
        const commits = await Commit.find({ branchId }).sort({ createdAt: 1 });
        let targetState = {};
        
        for (const commit of commits) {
            applyPatch(targetState, commit.patch); 
            if (commit._id.toString() === commitId) break; 
        }
        res.status(200).json(targetState);
    } catch (error) {
        res.status(500).json({ error: "Failed to reconstruct historical state" });
    }
};