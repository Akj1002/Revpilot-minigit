import mongoose from 'mongoose';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Repo from '../models/Repo.js';
import Branch from '../models/Branch.js';
import Commit from '../models/Commit.js';

export const initRepo = async (req, res) => {
    try {
        const { name, initialData, ownerId } = req.body;

        const existingRepo = await Repo.findOne({ name });
        if (existingRepo) return res.status(400).json({ error: "Repository name already exists." });
        if (!ownerId) return res.status(401).json({ error: "Owner ID is required." });

        const repoId = new mongoose.Types.ObjectId();
        const branchId = new mongoose.Types.ObjectId();
        const commitId = new mongoose.Types.ObjectId();

        const firstCommit = new Commit({
            _id: commitId, message: "Initial Commit",
            data: initialData || { dataset: "empty" },
            branchId: branchId, patch: []
        });

        const mainBranch = new Branch({
            _id: branchId, name: "main",
            repositoryId: repoId, head: commitId
        });

        const newRepo = new Repo({
            _id: repoId, name: name, ownerId: ownerId,
            branches: [branchId], defaultBranch: branchId
        });

        await Promise.all([firstCommit.save(), mainBranch.save(), newRepo.save()]);
        res.status(201).json({ repo: newRepo, branchId });
    } catch (error) {
        res.status(500).json({ error: "Initialization Failed: " + error.message });
    }
};


export const getAllRepos = async (req, res) => {
    try {
        const ownerId = req.params.ownerId || req.user?.id;
        const repos = await Repo.find({ ownerId })
            .sort({ createdAt: -1 })
            .populate({ path: 'defaultBranch', strictPopulate: false });
        res.json(repos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRepoById = async (req, res) => {
    try {
        const repo = await Repo.findById(req.params.id)
            .populate({
                path: 'branches', strictPopulate: false,
                populate: { path: 'head', strictPopulate: false }
            });
        if (!repo) return res.status(404).json({ error: "Repository not found" });
        res.json(repo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const executeCode = async (req, res) => {
    try {
        const { language, code } = req.body;
        if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY missing in backend" });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const prompt = `You are a strict headless code execution engine for ${language}. Run the code and reply ONLY with the exact standard output (stdout) or standard error (stderr). No markdown, no explanations.\nCode:\n${code}`;
        const result = await model.generateContent(prompt);
        let output = result.response.text().trim().replace(/^```[a-z]*\n/, '').replace(/```$/, '').trim();

        res.json({ output: output || "(No output returned)" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * 💾 PUSH COMMIT
 */
export const pushCommit = async (req, res) => {
    try {
        const { repoId } = req.params;
        const { content, message } = req.body;

        const repo = await Repo.findById(repoId).populate({ path: 'defaultBranch', strictPopulate: false });
        if (!repo) return res.status(404).json({ error: "Repo not found" });

        const headCommitId = repo.defaultBranch.head;
        const updatedCommit = await Commit.findByIdAndUpdate(
            headCommitId,
            { data: content, message: message || "Updated via Web IDE" },
            { new: true }
        );

        res.json({ message: "Successfully pushed to origin/main", commit: updatedCommit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const renameRepo = async (req, res) => {
    try {
        const { newName } = req.body;
        const updatedRepo = await Repo.findByIdAndUpdate(
            req.params.id, { name: newName }, { new: true }
        ).populate({
            path: 'branches', strictPopulate: false,
            populate: { path: 'head', strictPopulate: false }
        });

        res.json({ message: "Renamed successfully", repo: updatedRepo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteRepo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRepo = await Repo.findByIdAndDelete(id);
        
        if (!deletedRepo) {
            return res.status(404).json({ error: "Repository not found" });
        }
        
        res.json({ message: "Repository deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};