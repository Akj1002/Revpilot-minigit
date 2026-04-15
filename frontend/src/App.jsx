import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRepoStore } from './store/useRepoStore';
import { LogOut, Activity } from 'lucide-react';

// --- Public Page Imports ---
import Landing from './pages/Landing';
import Features from './pages/Features';
import Ai from './pages/Ai';
import Docs from './pages/Docs';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';

// --- Private Page Imports ---
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Branches from './pages/Branches';
import RevPilot from './pages/RevPilot';
import Settings from './pages/Settings';

// --- Component Imports ---
import Sidebar from './components/Sidebar';
import InitRepo from './components/InitRepo';

function App() {
    const { token, branchId, repoName, logout, user } = useRepoStore();
    const isAuthenticated = !!token; 

    return (
        <Router>
            <div style={{ backgroundColor: '#010409', color: '#c9d1d9', minHeight: '100vh', display: 'flex', width: '100vw' }}>
                
                {/* --- 🛡️ PHASE 1: PUBLIC / AUTH GUARD --- */}
                {!isAuthenticated ? (
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/ai" element={<Ai />} />
                        <Route path="/docs" element={<Docs />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                ) : (
                    /* --- 🔓 PHASE 2: AUTHORIZED LAYOUT --- */
                    <div style={{ display: 'flex', flex: 1, width: '100%' }}>
                        
                        {/* Sidebar only shows when a repository workspace is active */}
                        {branchId && <Sidebar />}

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            
                            {/* --- 🏗️ UNIVERSAL HEADER --- */}
                            <header style={{ 
                                height: '56px', 
                                borderBottom: '1px solid #30363d', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                padding: '0 24px', 
                                backgroundColor: '#0d1117',
                                zIndex: 10
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ 
                                        padding: '6px', 
                                        borderRadius: '6px', 
                                        background: 'linear-gradient(45deg, #2f81f7, #a371f7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Activity size={16} color="white" />
                                    </div>
                                    <span style={{ fontWeight: '800', fontSize: '14px', color: '#fff', letterSpacing: '1px' }}>
                                        REVBASE
                                    </span>
                                    {repoName && (
                                        <>
                                            <span style={{ color: '#484f58' }}>/</span>
                                            <span style={{ color: '#8b949e', fontSize: '13px', fontWeight: '500' }}>{repoName}</span>
                                        </>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '10px', color: '#8b949e', fontWeight: '700', textTransform: 'uppercase' }}>
                                            {user?.name || 'EXPLORER'}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#238636', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#238636', boxShadow: '0 0 5px #238636' }}></div>
                                            Online
                                        </div>
                                    </div>
                                    
                                    <div style={{ width: '1px', height: '20px', background: '#30363d' }}></div>

                                    <button 
                                        onClick={logout}
                                        style={{ 
                                            background: 'rgba(248, 81, 73, 0.05)', 
                                            border: '1px solid rgba(248, 81, 73, 0.2)', 
                                            color: '#f85149', 
                                            padding: '6px 14px', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            fontSize: '12px', 
                                            fontWeight: '600'
                                        }}
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            </header>

                            {/* --- 🚀 MAIN CONTENT AREA --- */}
                            <main style={{ flex: 1, overflowY: 'auto', position: 'relative', backgroundColor: '#010409' }}>
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/new" element={<InitRepo />} />
                                    
                                    {/* Workspace route MUST be here so it can read the :id from the URL */}
                                    <Route path="/workspace/:id" element={<Workspace />} />

                                    {/* Sidebar/Sub-tools that require a branch to be active */}
                                    {branchId && (
                                        <>
                                            <Route path="/branches" element={<Branches />} />
                                            <Route path="/revpilot" element={<RevPilot />} />
                                            <Route path="/settings" element={<Settings />} />
                                        </>
                                    )}

                                    {/* Redirect root to dashboard */}
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                            </main>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
}

export default App;