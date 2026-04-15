import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRepoStore } from '../store/useRepoStore';
import Editor, { DiffEditor } from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { 
    Play, X, Loader2, Sparkles, Send, UploadCloud, CheckCircle2, 
    FileJson, FileCode, FileText, Search, GitBranch, Settings as SettingsIcon,
    GitPullRequest, FilePlus, Blocks, Download, Check, Activity, 
    ChevronRight, Trash2, GitCommit, Files
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Workspace = () => {
    const { id } = useParams();
    const { activeRepo, fetchRepoById, isLoading: isRepoLoading, runCodeBackend, pushToBackend, updateRepoName } = useRepoStore();

    const [files, setFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [language, setLanguage] = useState('plaintext');
    const [viewMode, setViewMode] = useState('editor'); 
    
    const [activeSidebarTab, setActiveSidebarTab] = useState('files');
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState([]);
    
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [messages, setMessages] = useState([{ role: 'ai', text: 'RevPilot Gen-2 initialized. I can read your active file. How can I help?' }]);

    const [activeModal, setActiveModal] = useState(null); 
    const [actionLoading, setActionLoading] = useState(false);
    const [newRepoName, setNewRepoName] = useState('');
    const [prTitle, setPrTitle] = useState('');
    const [commitMessage, setCommitMessage] = useState(''); 

    useEffect(() => { if (id) fetchRepoById(id); }, [id, fetchRepoById]);

    useEffect(() => {
        if (activeRepo && activeRepo.branches?.length > 0) {
            setNewRepoName(activeRepo.name);
            const branch = activeRepo.branches[0];
            const headCommit = branch?.head;

            let parsedContent = "{}";
            if (headCommit && headCommit.data) {
                parsedContent = typeof headCommit.data === 'string' ? headCommit.data : JSON.stringify(headCommit.data, null, 2);
            }

            const initialFiles = [
                { name: 'neural_config.json', type: 'json', content: parsedContent, originalContent: parsedContent, isSaved: true },
                { name: 'main.py', type: 'python', content: 'import numpy as np\n\ndef train_model():\n    print("RevBase Kernel Ready")\n\ntrain_model()\n', originalContent: 'import numpy as np\n\ndef train_model():\n    print("RevBase Kernel Ready")\n\ntrain_model()\n', isSaved: true },
                { name: 'README.md', type: 'markdown', content: `# ${activeRepo.name}\n\nAgentic Neural Mesh Data.`, originalContent: `# ${activeRepo.name}\n\nAgentic Neural Mesh Data.`, isSaved: true }
            ];
            
            setFiles(initialFiles);
            if (!activeFile) handleFileSelect(initialFiles[1]);
        }
    }, [activeRepo]);

    const getLanguageFromExtension = (filename) => {
        if (filename.endsWith('.py')) return 'python';
        if (filename.endsWith('.js')) return 'javascript';
        if (filename.endsWith('.json')) return 'json';
        if (filename.endsWith('.md')) return 'markdown';
        if (filename.endsWith('.cpp')) return 'cpp';
        return 'plaintext';
    };

    const handleFileSelect = (file) => {
        setActiveFile(file);
        setFileContent(file.content);
        setLanguage(getLanguageFromExtension(file.name));
    };

    const handleContentChange = (newContent) => {
        setFileContent(newContent);
        setFiles(files.map(f => f.name === activeFile?.name ? { ...f, content: newContent, isSaved: false } : f));
    };

    const handleNewFile = () => {
        const fileName = prompt("Enter new file name (e.g., utils.py):");
        if (fileName && !files.find(f => f.name === fileName)) {
            const newFile = { name: fileName, type: getLanguageFromExtension(fileName), content: '', originalContent: '', isSaved: false };
            setFiles([...files, newFile]);
            handleFileSelect(newFile);
        }
    };

    const handleDeleteFile = (e, fileName) => {
        e.stopPropagation();
        if (files.length === 1) return alert("Cannot delete the last file.");
        const updatedFiles = files.filter(f => f.name !== fileName);
        setFiles(updatedFiles);
        if (activeFile?.name === fileName) handleFileSelect(updatedFiles[0]);
    };
    const handleDownload = () => {
        if (!activeFile) return;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = activeFile.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRunCode = async () => {
        setIsTerminalOpen(true); setIsRunning(true);
        setOutput(["[RevBase Engine] Booting Execution Sandbox...", "Compiling via Remote Kernel..."]);
        try {
            const resultText = await runCodeBackend(fileContent, language);
            setOutput(prev => [ ...prev, "-----------------------------------------", ...(resultText ? resultText.split('\n') : ["(No output)"]), "-----------------------------------------", "[Process completed with exit code 0]" ]);
        } catch (error) {
            setOutput(prev => [...prev, `⚠️ Backend Error: ${error.message}`, "[Process completed with exit code 1]"]);
        } finally { setIsRunning(false); }
    };

    const handlePush = async () => {
        if (!files.some(f => !f.isSaved)) return alert("No changes to commit!");
        
        setActiveModal('push'); 
        setActionLoading(true);
        try {
            const msg = commitMessage.trim() || `Update ${activeFile.name}`;
            await pushToBackend(activeRepo._id, fileContent, msg);
            setFiles(files.map(f => ({ ...f, isSaved: true, originalContent: f.content }))); 
            setCommitMessage('');
        } catch (error) { 
            console.error(error); 
        } finally { 
            setActionLoading(false); 
        }
    };

    const handleRename = async () => {
        if (!newRepoName.trim() || newRepoName === activeRepo.name) return;
        setActionLoading(true);
        await updateRepoName(activeRepo._id, newRepoName);
        setActionLoading(false);
        setActiveModal(null);
    };

    const handleAiSubmit = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;
        const currentInput = aiInput;
        setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
        setAiInput(''); setIsAiLoading(true);
        
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
            const contextPrompt = `You are RevPilot, an elite IDE assistant. Keep answers highly technical. The user is currently editing a ${language} file named ${activeFile?.name}. Here is the current code in their editor:\n\`\`\`\n${fileContent}\n\`\`\`\nUser query: "${currentInput}"`;
            const result = await model.generateContent(contextPrompt);
            setMessages(prev => [...prev, { role: 'ai', text: result.response.text() }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: `⚠️ Error: ${error.message}` }]);
        } finally { setIsAiLoading(false); }
    };

    const getIcon = (type) => {
        if (type === 'python') return <FileCode size={14} color="#3572A5" />;
        if (type === 'cpp') return <FileCode size={14} color="#f34b7d" />;
        if (type === 'json') return <FileJson size={14} color="#2ea043" />;
        if (type === 'markdown') return <FileText size={14} color="#58a6ff" />;
        return <FileText size={14} color="#8b949e" />;
    };

    if (isRepoLoading || !activeRepo) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#010409' }}><Loader2 size={32} className="spin" color="#2f81f7" /></div>;

    const unsavedFiles = files.filter(f => !f.isSaved);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', backgroundColor: '#010409', color: '#c9d1d9', fontFamily: 'Inter, system-ui, sans-serif', width: '100%' }}>
            
            {/* WORKSPACE HEADER */}
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #30363d', backgroundColor: '#0d1117', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#161b22', padding: '4px 12px', borderRadius: '6px', border: '1px solid #30363d', fontSize: '13px' }}>
                        <span style={{ color: '#8b949e', textTransform: 'lowercase' }}>{activeRepo.ownerId?.name?.split(' ')[0] || 'user'}</span>
                        <span style={{ margin: '0 6px', color: '#30363d' }}>/</span>
                        <span style={{ color: '#c9d1d9', fontWeight: '600' }}>{activeRepo.name}</span>
                    </div>
                    <span style={{ border: '1px solid #30363d', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', color: '#8b949e' }}>Private</span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setIsAiOpen(!isAiOpen)} style={{ background: 'transparent', border: '1px solid #30363d', color: isAiOpen ? '#a371f7' : '#8b949e', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <Sparkles size={14} /> RevPilot
                    </button>
                    {/* 🚀 BUTTONS RESTORED */}
                    <button onClick={() => setActiveModal('pr')} style={{ background: 'transparent', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <GitPullRequest size={14} /> Create PR
                    </button>
                    <button onClick={handleDownload} style={{ background: 'transparent', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} title="Download Current File">
                        <Download size={14} /> Export
                    </button>
                    <div style={{ width: '1px', height: '24px', background: '#30363d', margin: '0 4px' }}></div>
                    <button onClick={handleRunCode} style={{ background: 'linear-gradient(180deg, #2ea043 0%, #238636 100%)', border: '1px solid rgba(240, 246, 252, 0.1)', color: 'white', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <Play size={12} fill="currentColor" /> Run Code
                    </button>
                </div>
            </div>

            {/* MAIN IDE LAYOUT */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* ACTIVITY BAR */}
                <div style={{ width: '48px', backgroundColor: '#0d1117', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: '16px' }}>
                    <div onClick={() => setActiveSidebarTab('files')} style={{ cursor: 'pointer', color: activeSidebarTab === 'files' ? '#c9d1d9' : '#484f58', borderLeft: activeSidebarTab === 'files' ? '2px solid #f78166' : '2px solid transparent', padding: '4px 0', width: '100%', display: 'flex', justifyContent: 'center' }} title="Explorer"><Files size={22} strokeWidth={1.5} /></div>
                    <div onClick={() => setActiveSidebarTab('search')} style={{ cursor: 'pointer', color: activeSidebarTab === 'search' ? '#c9d1d9' : '#484f58', borderLeft: activeSidebarTab === 'search' ? '2px solid #f78166' : '2px solid transparent', padding: '4px 0', width: '100%', display: 'flex', justifyContent: 'center' }} title="Search"><Search size={22} strokeWidth={1.5} /></div>
                    <div onClick={() => setActiveSidebarTab('git')} style={{ cursor: 'pointer', position: 'relative', color: activeSidebarTab === 'git' ? '#c9d1d9' : '#484f58', borderLeft: activeSidebarTab === 'git' ? '2px solid #f78166' : '2px solid transparent', padding: '4px 0', width: '100%', display: 'flex', justifyContent: 'center' }} title="Source Control">
                        <GitCommit size={22} strokeWidth={1.5} />
                        {unsavedFiles.length > 0 && <div style={{ position: 'absolute', top: 0, right: '6px', background: '#2f81f7', color: 'white', fontSize: '9px', fontWeight: 'bold', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unsavedFiles.length}</div>}
                    </div>
                    <div onClick={() => setActiveSidebarTab('extensions')} style={{ cursor: 'pointer', color: activeSidebarTab === 'extensions' ? '#c9d1d9' : '#484f58', borderLeft: activeSidebarTab === 'extensions' ? '2px solid #f78166' : '2px solid transparent', padding: '4px 0', width: '100%', display: 'flex', justifyContent: 'center' }} title="Extensions"><Blocks size={22} strokeWidth={1.5} /></div>
                    <div style={{ flex: 1 }}></div>
                    <div onClick={() => setActiveModal('settings')} style={{ cursor: 'pointer', color: '#484f58' }} title="Settings"><SettingsIcon size={22} strokeWidth={1.5} /></div>
                </div>

                {/* DYNAMIC SIDEBAR */}
                <div style={{ width: '240px', backgroundColor: '#010409', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
                    {activeSidebarTab === 'files' && (
                        <>
                            <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                EXPLORER <FilePlus size={14} style={{ cursor: 'pointer', color: '#c9d1d9' }} onClick={handleNewFile} />
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <div style={{ padding: '4px 16px', fontSize: '12px', fontWeight: '700', color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: '4px' }}><ChevronRight size={14} /> {activeRepo.name}</div>
                                {files.map((file, idx) => (
                                    <div key={idx} onClick={() => handleFileSelect(file)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px 6px 36px', cursor: 'pointer', backgroundColor: activeFile?.name === file.name ? '#161b22' : 'transparent', color: activeFile?.name === file.name ? '#58a6ff' : '#8b949e', fontSize: '13px' }}>
                                        {getIcon(file.type)} <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                        {!file.isSaved && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#c9d1d9' }}></div>}
                                        {activeFile?.name === file.name && files.length > 1 && <Trash2 size={12} color="#f85149" onClick={(e) => handleDeleteFile(e, file.name)} style={{ marginLeft: 'auto' }}/>}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeSidebarTab === 'git' && (
                        <>
                            <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SOURCE CONTROL</div>
                            <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #30363d' }}>
                                <textarea 
                                    placeholder="Message (Ctrl+Enter to commit)" 
                                    value={commitMessage}
                                    onChange={(e) => setCommitMessage(e.target.value)}
                                    style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', resize: 'none', height: '60px', marginBottom: '8px', outline: 'none', boxSizing: 'border-box' }}
                                />
                                <button onClick={handlePush} disabled={unsavedFiles.length === 0} style={{ width: '100%', background: unsavedFiles.length > 0 ? '#2f81f7' : '#21262d', color: unsavedFiles.length > 0 ? '#fff' : '#8b949e', border: '1px solid rgba(240, 246, 252, 0.1)', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: unsavedFiles.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                                    <Check size={14} /> Commit & Sync
                                </button>
                            </div>
                            <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CHANGES {unsavedFiles.length > 0 && `(${unsavedFiles.length})`}</div>
                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                {unsavedFiles.length === 0 ? (
                                    <div style={{ padding: '0 16px', fontSize: '12px', color: '#8b949e', textAlign: 'center', marginTop: '20px' }}>No unsaved changes.</div>
                                ) : (
                                    unsavedFiles.map((file, idx) => (
                                        <div key={idx} onClick={() => { handleFileSelect(file); setViewMode('diff'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', cursor: 'pointer', color: '#c9d1d9', fontSize: '13px' }}>
                                            {getIcon(file.type)} <span>{file.name}</span>
                                            <span style={{ color: '#d29922', fontSize: '12px', marginLeft: 'auto', fontWeight: '600' }}>M</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                    {(activeSidebarTab === 'search' || activeSidebarTab === 'extensions') && (<div style={{ padding: '20px', color: '#8b949e', fontSize: '12px', textAlign: 'center' }}>Panel coming soon.</div>)}
                </div>

                {/* EDITOR & TERMINAL */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117', position: 'relative' }}>
                    <div style={{ display: 'flex', backgroundColor: '#010409', borderBottom: '1px solid #30363d' }}>
                        {activeFile && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#0d1117', borderTop: '1px solid #f78166', borderRight: '1px solid #30363d', fontSize: '13px', color: '#c9d1d9', minWidth: '150px' }}>
                                {getIcon(activeFile.type)} {activeFile.name} {!activeFile.isSaved && <span style={{ color: '#8b949e' }}>•</span>}
                            </div>
                        )}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', padding: '0 16px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', background: '#161b22', borderRadius: '6px', border: '1px solid #30363d', padding: '2px' }}>
                                <button onClick={() => setViewMode('editor')} style={{ background: viewMode === 'editor' ? '#30363d' : 'transparent', color: viewMode === 'editor' ? '#c9d1d9' : '#8b949e', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Editor</button>
                                <button onClick={() => setViewMode('diff')} style={{ background: viewMode === 'diff' ? '#30363d' : 'transparent', color: viewMode === 'diff' ? '#c9d1d9' : '#8b949e', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Diff</button>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, position: 'relative' }}>
                        {viewMode === 'editor' ? (
                            <Editor height="100%" language={language} theme="vs-dark" value={fileContent} onChange={handleContentChange} options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", padding: { top: 16 } }} />
                        ) : (
                            <DiffEditor height="100%" language={language} theme="vs-dark" original={activeFile?.originalContent || ""} modified={fileContent} options={{ renderSideBySide: true, minimap: { enabled: false } }} />
                        )}

                        {isTerminalOpen && (
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: '#0d1117', borderTop: '1px solid #30363d', display: 'flex', flexDirection: 'column', zIndex: 10, boxShadow: '0 -4px 20px rgba(0,0,0,0.3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: '#161b22', borderBottom: '1px solid #30363d' }}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ fontSize: '11px', color: '#c9d1d9', fontWeight: '600', borderBottom: '1px solid #f78166', paddingBottom: '6px', marginBottom: '-9px' }}>TERMINAL</div>
                                        <div style={{ fontSize: '11px', color: '#8b949e', cursor: 'pointer' }}>OUTPUT</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setOutput([])} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }} title="Clear"><Activity size={14} /></button>
                                        <button onClick={() => setIsTerminalOpen(false)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={14} /></button>
                                    </div>
                                </div>
                                <div style={{ padding: '12px 16px', flex: 1, overflowY: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#c9d1d9', whiteSpace: 'pre-wrap' }}>
                                    <div style={{ color: '#2ea043', marginBottom: '8px' }}>user@revbase:~/workspace$ ./run_kernel.sh</div>
                                    {output.map((line, idx) => <div key={idx} style={{ color: line.includes('Error') || line.includes('❌') ? '#f85149' : 'inherit' }}>{line}</div>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* REV-PILOT AI PANE */}
                {isAiOpen && (
                    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', background: '#010409', borderLeft: '1px solid #30363d' }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c9d1d9' }}><Sparkles size={16} color="#a371f7" /> <span style={{ fontWeight: '600', fontSize: '13px' }}>RevPilot Copilot</span></div>
                            <X size={14} color="#8b949e" style={{ cursor: 'pointer' }} onClick={() => setIsAiOpen(false)} />
                        </div>
                        
                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{ maxWidth: '95%', padding: '12px 16px', background: msg.role === 'user' ? '#1f6feb' : '#0d1117', border: msg.role === 'ai' ? '1px solid #30363d' : 'none', color: '#c9d1d9', borderRadius: '12px', fontSize: '13px', lineHeight: '1.6' }}>
                                        {msg.role === 'user' ? msg.text : (
                                            <ReactMarkdown components={{ code({node, inline, className, children, ...props}) { return !inline ? ( <div style={{ background: '#010409', padding: '10px', borderRadius: '6px', overflowX: 'auto', border: '1px solid #30363d', margin: '8px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{children}</div> ) : ( <code style={{ background: '#161b22', padding: '2px 4px', borderRadius: '4px', color: '#ff7b72', border: '1px solid #30363d' }} {...props}>{children}</code> ) } }}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isAiLoading && <div style={{ padding: '10px', color: '#8b949e', fontSize: '13px', display: 'flex', gap: '8px' }}><Loader2 size={14} className="spin" /> Thinking...</div>}
                        </div>
                        
                        <div style={{ padding: '16px', borderTop: '1px solid #30363d' }}>
                            <form onSubmit={handleAiSubmit} style={{ display: 'flex', background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '4px', focusWithin: { borderColor: '#58a6ff' } }}>
                                <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} disabled={isAiLoading} placeholder="Ask RevPilot..." style={{ flex: 1, background: 'transparent', border: 'none', padding: '8px 10px', color: '#fff', outline: 'none', fontSize: '13px' }} />
                                <button type="submit" disabled={isAiLoading} style={{ background: aiInput.trim() ? '#2f81f7' : 'transparent', border: 'none', color: aiInput.trim() ? 'white' : '#8b949e', padding: '8px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}><Send size={14} /></button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* BOTTOM STATUS BAR */}
            <div style={{ height: '24px', background: 'linear-gradient(90deg, #1f6feb 0%, #30363d 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', color: 'white', fontSize: '11px', fontWeight: '500' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitBranch size={12}/> main</span>
                    <span onClick={() => setActiveSidebarTab('git')} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><UploadCloud size={12}/> {unsavedFiles.length > 0 ? `${unsavedFiles.length} Unsaved Changes` : 'Synced'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span>Imagine Cup 2026</span>
                    <span style={{ textTransform: 'uppercase' }}>{language}</span>
                </div>
            </div>

            {/* 🚀 MODALS RESTORED 🚀 */}
            {activeModal && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    
                    {/* Push / Success Modal */}
                    {(activeModal === 'push' || activeModal === 'pr_success') && (
                        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', width: '350px', padding: '30px', textAlign: 'center' }}>
                            {actionLoading ? <><Loader2 size={40} color="#2f81f7" className="spin" style={{ margin: '0 auto 20px' }} /><h3 style={{ color: '#c9d1d9' }}>Working...</h3></> : <><CheckCircle2 size={50} color="#3fb950" style={{ margin: '0 auto 20px' }} /><h3 style={{ color: '#c9d1d9', marginBottom: '20px' }}>{activeModal === 'push' ? 'Commit Successful!' : 'Pull Request Created!'}</h3><button onClick={() => setActiveModal(null)} style={{ background: '#21262d', color: 'white', border: '1px solid #30363d', padding: '6px 20px', borderRadius: '6px', cursor: 'pointer' }}>Close</button></>}
                        </div>
                    )}

                    {/* PR Creation Modal */}
                    {activeModal === 'pr' && (
                        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', width: '500px', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: '8px' }}><GitPullRequest color="#a371f7"/> Open a Pull Request</h2>
                                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X /></button>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', color: '#8b949e', fontSize: '12px', marginBottom: '8px' }}>Title</label>
                                <input type="text" value={prTitle} onChange={e => setPrTitle(e.target.value)} placeholder="e.g., Update neural mesh routing" style={{ width: '100%', background: '#010409', border: '1px solid #30363d', color: '#fff', padding: '10px', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button onClick={() => { setActionLoading(true); setTimeout(() => { setActionLoading(false); setActiveModal('pr_success'); }, 1500); }} disabled={!prTitle.trim() || actionLoading} style={{ width: '100%', background: '#238636', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '600', cursor: prTitle.trim() ? 'pointer' : 'not-allowed', opacity: prTitle.trim() ? 1 : 0.5 }}>
                                {actionLoading ? <Loader2 size={16} className="spin" /> : 'Create Pull Request'}
                            </button>
                        </div>
                    )}

                    {/* Settings Modal (for Renaming) */}
                    {activeModal === 'settings' && (
                        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', width: '700px', display: 'flex', overflow: 'hidden', height: '400px' }}>
                            <div style={{ width: '200px', borderRight: '1px solid #30363d', background: '#010409', padding: '16px 0' }}>
                                <div style={{ padding: '8px 16px', color: '#c9d1d9', fontSize: '14px', fontWeight: '600', background: '#161b22', borderLeft: '3px solid #f78166', cursor: 'pointer' }}><SettingsIcon size={14} style={{ marginRight: '8px' }}/> General</div>
                                <div style={{ padding: '8px 16px', color: '#8b949e', fontSize: '14px', cursor: 'pointer' }}>Collaborators</div>
                            </div>
                            <div style={{ flex: 1, padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #30363d', paddingBottom: '16px', marginBottom: '24px' }}>
                                    <h2 style={{ margin: 0, fontSize: '20px', color: '#c9d1d9', fontWeight: '400' }}>General</h2>
                                    <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={20}/></button>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', color: '#c9d1d9', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Repository name</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input type="text" value={newRepoName} onChange={(e) => setNewRepoName(e.target.value)} style={{ flex: 1, background: '#010409', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 12px', borderRadius: '6px', outline: 'none' }} />
                                        <button onClick={handleRename} disabled={actionLoading} style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 16px', borderRadius: '6px', fontWeight: '600', cursor: actionLoading ? 'wait' : 'pointer' }}>
                                            {actionLoading ? <Loader2 size={14} className="spin"/> : 'Rename'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Workspace;