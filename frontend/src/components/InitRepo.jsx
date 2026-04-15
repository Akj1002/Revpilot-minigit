import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepoStore } from '../store/useRepoStore';
import Editor from '@monaco-editor/react';
import { FolderGit2, Loader2, FileJson, Info } from 'lucide-react';

const InitRepo = () => {
    const navigate = useNavigate();
    const { user, initRepository } = useRepoStore();

    const [repoName, setRepoName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // 🚀 NEW: Reference for the hidden file input
    const fileInputRef = useRef(null);

    const defaultJson = `{
  "dataset": "silent-signal-mesh",
  "version": "1.0.0",
  "metadata": {
    "author": "${user?.name || 'Neural Developer'}",
    "description": "Agentic Neural Mesh for Mental Health"
  },
  "records": []
}`;

    const [jsonContent, setJsonContent] = useState(defaultJson);

    // 🚀 NEW: Trigger the hidden file input when "Import" is clicked
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    // 🚀 NEW: Handle the actual file upload and read its contents
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const uploadedJson = event.target.result;
                // Verify it's actually valid JSON before pasting it
                JSON.parse(uploadedJson); 
                
                // Update the editor content
                setJsonContent(uploadedJson);
                
                // Auto-fill the repo name (e.g., "my-dataset.json" becomes "my-dataset")
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                setRepoName(nameWithoutExt.toLowerCase().replace(/\s+/g, '-'));
                
                // Reset input so you can upload the same file again if needed
                e.target.value = null; 
            } catch (err) {
                alert("❌ Invalid JSON file. Please upload a valid .json configuration.");
            }
        };
        reader.readAsText(file);
    };

    const handleInitialize = async (e) => {
        e.preventDefault();

        if (!repoName.trim()) {
            alert("Please enter a valid repository name.");
            return;
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonContent);
        } catch (error) {
            alert("❌ Invalid JSON syntax. Please fix the structure before initializing.");
            return;
        }

        setIsLoading(true);

        try {
            const data = await initRepository({
                name: repoName.toLowerCase().replace(/\s+/g, '-'),
                initialData: parsedData
            });

            if (data && data.repo) {
                navigate(`/workspace/${data.repo._id}`);
            }
        } catch (error) {
            console.error("Init Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 56px)', backgroundColor: '#010409', padding: '60px 20px', overflowY: 'auto' }}>
            
            {/* 🚀 NEW: Hidden File Input */}
            <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
            />

            <div style={{ width: '100%', maxWidth: '680px' }}>
                <div style={{ marginBottom: '32px', borderBottom: '1px solid #30363d', paddingBottom: '24px' }}>
                    <h1 style={{ color: '#f0f6fc', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FolderGit2 size={28} color="#8b949e" />
                        Create a new repository
                    </h1>
                    <p style={{ color: '#8b949e', margin: 0, fontSize: '14px' }}>
                        A repository contains all project files, including the revision history. Already have a neural dataset locally?{' '}
                        <span 
                            onClick={handleImportClick} 
                            style={{ color: '#58a6ff', cursor: 'pointer' }}
                            onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                        >
                            Import a repository.
                        </span>
                    </p>
                </div>

                <form onSubmit={handleInitialize}>
                    {/* REPO NAME SECTION */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c9d1d9', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                            Repository name <span style={{ color: '#f85149' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ color: '#8b949e', fontSize: '14px', fontWeight: '600', background: '#161b22', padding: '6px 12px', borderRadius: '6px', border: '1px solid #30363d' }}>
                                {user?.name?.split(' ')[0].toLowerCase() || 'owner'} /
                            </div>
                            <input 
                                type="text" 
                                required
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value)}
                                className="repo-input"
                                placeholder="e.g., neural-mesh-v1"
                                style={{ 
                                    flex: 1, background: '#010409', border: '1px solid #30363d', 
                                    color: '#fff', padding: '6px 12px', borderRadius: '6px', outline: 'none', 
                                    fontSize: '14px', transition: 'border-color 0.2s', boxShadow: 'inset 0 0 0 1px transparent'
                                }} 
                            />
                        </div>
                        <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Info size={12} /> Great repository names are short and memorable.
                        </p>
                    </div>

                    <div style={{ height: '1px', background: '#30363d', margin: '24px 0' }}></div>

                    {/* JSON EDITOR SECTION */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                            <label style={{ color: '#c9d1d9', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileJson size={16} color="#8b949e" /> Initialize this repository with a configuration
                            </label>
                            <span style={{ fontSize: '12px', color: '#8b949e', background: '#161b22', padding: '2px 8px', borderRadius: '12px', border: '1px solid #30363d' }}>
                                neural_config.json
                            </span>
                        </div>
                        <p style={{ color: '#8b949e', fontSize: '12px', marginBottom: '12px' }}>
                            This will set up the foundational dataset architecture for your neural engine.
                        </p>
                        
                        <div style={{ border: '1px solid #30363d', borderRadius: '6px', overflow: 'hidden', height: '220px', background: '#0d1117' }}>
                            <Editor
                                height="100%"
                                language="json"
                                theme="vs-dark"
                                value={jsonContent}
                                onChange={(value) => setJsonContent(value || '')}
                                options={{ 
                                    minimap: { enabled: false }, 
                                    fontSize: 13, 
                                    fontFamily: "'JetBrains Mono', monospace",
                                    padding: { top: 12, bottom: 12 },
                                    scrollBeyondLastLine: false,
                                    lineNumbers: 'off'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ height: '1px', background: '#30363d', margin: '24px 0' }}></div>

                    {/* SUBMIT SECTION */}
                    <div>
                        <button 
                            type="submit" 
                            disabled={isLoading || !repoName.trim()}
                            style={{ 
                                background: '#238636', 
                                color: 'white', border: '1px solid rgba(240, 246, 252, 0.1)', 
                                padding: '6px 16px', borderRadius: '6px', 
                                fontSize: '14px', fontWeight: '600', cursor: isLoading || !repoName.trim() ? 'not-allowed' : 'pointer', 
                                display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                                opacity: isLoading || !repoName.trim() ? 0.6 : 1, transition: 'opacity 0.2s',
                                boxShadow: '0 0 transparent, 0 0 transparent, 0 1px 0 rgba(27, 31, 36, 0.1)'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> 
                                    Creating repository...
                                </>
                            ) : (
                                'Create repository'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } } 
                .repo-input:focus { border-color: #58a6ff !important; box-shadow: inset 0 0 0 1px #58a6ff !important; }
            `}</style>
        </div>
    );
};

export default InitRepo;