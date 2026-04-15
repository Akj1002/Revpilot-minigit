import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Cpu, Code2 } from 'lucide-react';
import '../Landing.css';

const Ai = () => {
    const navigate = useNavigate();

    return (
        <div className="nextgen-landing">
            {/* Ambient Background Glow */}
            <div className="glow-orb" style={{ top: '100px', background: 'radial-gradient(ellipse at center, rgba(163, 113, 247, 0.4) 0%, transparent 70%)' }}></div>
            
            <div className="ng-nav-container">
                <nav className="ng-nav">
                    {/* 1. LOGO */}
                    <div className="ng-logo" onClick={() => navigate('/')}>
                        <Database color="#a371f7" size={24} /> 
                        <span>RevBase</span>
                    </div>

                    {/* 2. LINKS */}
                    <div className="ng-nav-links">
                        <span onClick={() => navigate('/features')}>Features</span>
                        <span className="active-nav-link">RevPilot AI</span>
                        <span onClick={() => navigate('/docs')}>Documentation</span>
                        <span onClick={() => navigate('/pricing')}>Pricing</span>
                    </div>

                    {/* 3. AUTH WRAPPER - Corrected Alignment */}
                    <div className="ng-auth-wrapper">
                        <button className="ng-btn-login" onClick={() => navigate('/auth')}>
                            Log in
                        </button>
                        <button className="ng-btn-signup" onClick={() => navigate('/auth')}>
                            Sign Up
                        </button>
                    </div>
                </nav>
            </div>

            <main className="ng-hero" style={{ paddingBottom: '100px' }}>
                <Cpu size={64} color="#a371f7" style={{ marginBottom: '20px' }} />
                
                <h1 className="ng-title">
                    RevPilot <span className="ng-title-accent">Gen-2</span>
                </h1>
                
                <p className="ng-subtitle">
                    Your algorithmic co-pilot. Write C++, Java, and Python scripts instantly inside the workspace. 
                    Let AI handle the boilerplate.
                </p>

                {/* AI Console Display */}
                <div style={{ 
                    width: '100%', 
                    maxWidth: '800px', 
                    background: '#0d1117', 
                    border: '1px solid rgba(163, 113, 247, 0.4)', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    textAlign: 'left', 
                    boxShadow: '0 0 40px rgba(163, 113, 247, 0.2)',
                    zIndex: 10 
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '20px', 
                        borderBottom: '1px solid #30363d', 
                        paddingBottom: '12px' 
                    }}>
                        <Code2 size={18} color="#8b949e" /> 
                        <span style={{ color: '#8b949e', fontSize: '13px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                            RevPilot Agent Status: <span style={{ color: '#27c93f' }}>ACTIVE</span>
                        </span>
                    </div>

                    <div style={{ 
                        margin: 0, 
                        color: '#c9d1d9', 
                        fontFamily: '"JetBrains Mono", monospace', 
                        fontSize: '14px', 
                        lineHeight: '1.8' 
                    }}>
                        <p style={{ marginBottom: '16px' }}>
                            <span style={{ color: '#a371f7', fontWeight: 'bold' }}>User:</span> Optimize this neural network layer for memory efficiency.
                        </p>
                        
                        <p style={{ marginBottom: '8px' }}>
                            <span style={{ color: '#27c93f', fontWeight: 'bold' }}>RevPilot:</span> Analyzing tensors... applying quantization.
                        </p>
                        
                        <p style={{ color: '#8b949e', fontStyle: 'italic' }}>
                            Generating optimized C++ extensions...
                        </p>
                    </div>
                </div>
            </main>

            <footer className="ng-footer">
                <div className="ng-footer-line"></div>
                <p>© 2026 RevBase Systems | AI Research Division</p>
            </footer>
        </div>
    );
};

export default Ai;