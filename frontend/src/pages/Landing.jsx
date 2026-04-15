import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Zap, ArrowRight, Terminal, Share2, Shield, Cpu, Globe } from 'lucide-react';
import '../Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="nextgen-landing">
            <div className="glow-orb"></div>

            {/* Floating Glass Navbar */}
            <div className="ng-nav-container">
                <nav className="ng-nav">
                    <div className="ng-logo" onClick={() => navigate('/')}>
                        <Database color="#a371f7" size={24} />
                        <span>RevBase</span>
                    </div>
                    
                    <div className="ng-nav-links">
                        <span onClick={() => navigate('/features')}>Features</span>
                        <span onClick={() => navigate('/ai')}>RevPilot AI</span>
                        <span onClick={() => navigate('/docs')}>Documentation</span>
                        <span onClick={() => navigate('/pricing')}>Pricing</span>
                    </div>
                    
                    <div className="ng-auth-wrapper">
                        <button className="ng-btn-login" onClick={() => navigate('/auth')}>Log in</button>
                        <button className="ng-btn-signup" onClick={() => navigate('/auth')}>Sign Up</button>
                    </div>
                </nav>
            </div>

            {/* Main Hero Section */}
            <main className="ng-hero">
                <div className="ng-badge" onClick={() => navigate('/auth')}>
                    <Zap size={16} fill="#a371f7" /> RevPilot AI Gen-2 is now live
                </div>

                <h1 className="ng-title">
                    Version Control for the <br/>
                    <span className="ng-title-accent">Neural Generation.</span>
                </h1>
                
                <p className="ng-subtitle">
                    The elite workspace for your datasets, agents, and algorithms. 
                    Build, track, and deploy complex C++, Java, and Python pipelines without the chaos.
                </p>
                
                <div className="ng-hero-actions">
                    <button className="ng-btn-primary" onClick={() => navigate('/auth')}>
                        Initialize Workspace <ArrowRight size={18} />
                    </button>
                    <button className="ng-btn-secondary" onClick={() => navigate('/docs')}>
                        <Terminal size={18} /> View Documentation
                    </button>
                </div>

                {/* Mock Editor Visual */}
                <div className="ng-mock-editor">
                    <div className="ng-mock-header">
                        <div className="ng-mock-dot" style={{ backgroundColor: '#ff5f56' }}></div>
                        <div className="ng-mock-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
                        <div className="ng-mock-dot" style={{ backgroundColor: '#27c93f' }}></div>
                        <span style={{ marginLeft: '12px', fontSize: '12px', color: '#8b949e', fontFamily: 'monospace' }}>main.py — RevBase Workspace</span>
                    </div>
                    <div className="ng-mock-code">
                        <span className="code-keyword">import</span> numpy <span className="code-keyword">as</span> np<br/>
                        <span className="code-keyword">from</span> revbase <span className="code-keyword">import</span> RevPilot, ModelRegistry<br/>
                        <br/>
                        <span className="code-comment"># Initialize RevPilot for real-time algorithm generation</span><br/>
                        pilot = RevPilot(mode=<span className="code-string">"aggressive-optimization"</span>)<br/>
                        <br/>
                        <span className="code-keyword">def</span> <span className="code-func">train_neural_mesh</span>(dataset_id: str):<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;data = pilot.pull_dataset(dataset_id)<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;model = pilot.generate_architecture(target=<span className="code-string">"marine-vision"</span>)<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> model.compile()<br/>
                    </div>
                </div>

                {/* --- NEW: FEATURES SECTION --- */}
                <section className="ng-features-grid">
                    <div className="ng-feature-card">
                        <Share2 color="#a371f7" size={32} />
                        <h3>Real-time Sync</h3>
                        <p>Instantaneous neural weight distribution across your entire agentic mesh.</p>
                    </div>
                    <div className="ng-feature-card">
                        <Shield color="#2f81f7" size={32} />
                        <h3>Quantum Security</h3>
                        <p>End-to-end encryption for sensitive medical and proprietary datasets.</p>
                    </div>
                    <div className="ng-feature-card">
                        <Cpu color="#a371f7" size={32} />
                        <h3>Edge Deployment</h3>
                        <p>Push optimized kernels directly to edge devices with a single commit.</p>
                    </div>
                    <div className="ng-feature-card">
                        <Globe color="#2f81f7" size={32} />
                        <h3>Global Registry</h3>
                        <p>Access thousands of open-source neural architectures from our community.</p>
                    </div>
                </section>

                {/* --- NEW: FOOTER --- */}
                <footer className="ng-footer">
                    <div className="ng-footer-line"></div>
                    <p>© 2026 RevBase Systems. Built for the Imagine Cup.</p>
                </footer>
            </main>
        </div>
    );
};

export default Landing;