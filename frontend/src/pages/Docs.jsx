import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, BookOpen } from 'lucide-react';
import '../Landing.css';

const Docs = () => {
    const navigate = useNavigate();
    
    return (
        <div className="nextgen-landing">
            <div className="glow-orb"></div>

            {/* Floating Glass Navbar - Now consistent with the rest of the app */}
            <div className="ng-nav-container">
                <nav className="ng-nav">
                    <div className="ng-logo" onClick={() => navigate('/')}>
                        <Database color="#a371f7" size={24} /> 
                        <span>RevBase</span>
                    </div>
                    
                    <div className="ng-nav-links">
                        <span onClick={() => navigate('/features')}>Features</span>
                        <span onClick={() => navigate('/ai')}>RevPilot AI</span>
                        <span className="active-nav-link">Documentation</span>
                        <span onClick={() => navigate('/pricing')}>Pricing</span>
                    </div>
                    
                    {/* Updated wrapper for button styling */}
                    <div className="ng-auth-wrapper">
                        <button className="ng-btn-login" onClick={() => navigate('/auth')}>Log in</button>
                        <button className="ng-btn-signup" onClick={() => navigate('/auth')}>Sign Up</button>
                    </div>
                </nav>
            </div>

            {/* Documentation Layout */}
            <main className="ng-hero" style={{ 
                flexDirection: 'row', 
                alignItems: 'flex-start', 
                textAlign: 'left',
                maxWidth: '1200px',
                paddingTop: '160px' 
            }}>
                {/* Sidebar */}
                <aside style={{ 
                    width: '250px', 
                    paddingRight: '40px', 
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'sticky',
                    top: '160px'
                }}>
                    <h4 style={{ color: '#8b949e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                        Getting Started
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                        <li style={{ color: '#2f81f7', fontWeight: '600', cursor: 'pointer' }}>Introduction</li>
                        <li style={{ color: '#8b949e', cursor: 'pointer' }}>Authentication</li>
                        <li style={{ color: '#8b949e', cursor: 'pointer' }}>Creating Repositories</li>
                        <li style={{ color: '#8b949e', cursor: 'pointer' }}>Version Control Logic</li>
                    </ul>
                </aside>

                {/* Main Content Area */}
                <div style={{ flex: 1, paddingLeft: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <BookOpen color="#a371f7" size={32} /> 
                        <h1 className="ng-title" style={{ fontSize: '3rem', textAlign: 'left', marginBottom: 0 }}>
                            Introduction
                        </h1>
                    </div>
                    
                    <p className="ng-subtitle" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '40px' }}>
                        RevBase is the ultimate environment for data engineers and ML researchers. 
                        Manage your agentic workflows and datasets with neural-grade version control.
                    </p>

                    <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                        Quick Start
                    </h2>
                    
                    <div className="ng-mock-editor" style={{ height: 'auto', marginBottom: '40px' }}>
                        <div className="ng-mock-header">
                             <div className="ng-mock-dot" style={{ backgroundColor: '#ff5f56' }}></div>
                             <div className="ng-mock-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
                             <div className="ng-mock-dot" style={{ backgroundColor: '#27c93f' }}></div>
                             <span style={{ marginLeft: '12px', fontSize: '12px', color: '#8b949e' }}>Terminal</span>
                        </div>
                        <div className="ng-mock-code">
                            <span className="code-keyword">npm</span> install @revbase/sdk<br/>
                            <span className="code-keyword">revbase</span> init <span className="code-string">my-neural-project</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="ng-footer">
                <div className="ng-footer-line"></div>
                <p>© 2026 RevBase Systems | Imagine Cup Submission</p>
            </footer>
        </div>
    );
};

export default Docs;