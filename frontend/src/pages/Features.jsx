import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, GitBranch, Shield, Zap } from 'lucide-react';
import '../Landing.css';

const Features = () => {
    const navigate = useNavigate();

    const featuresList = [
        { 
            icon: <GitBranch size={32} color="#2f81f7" />, 
            title: "Dataset Branching", 
            desc: "Experiment safely. Fork your main dataset, run your computer vision pipelines, and merge the best results." 
        },
        { 
            icon: <Database size={32} color="#a371f7" />, 
            title: "JSON Integrity", 
            desc: "Native understanding of JSON structures. We don't just diff text; we diff data schemas and nested objects." 
        },
        { 
            icon: <Zap size={32} color="#ffbd2e" />, 
            title: "High-Speed Sync", 
            desc: "Push and pull massive datasets with highly optimized binary deltas to save bandwidth." 
        },
        { 
            icon: <Shield size={32} color="#27c93f" />, 
            title: "Immutable History", 
            desc: "Every model weight, every record, every tweak is cryptographically hashed and stored forever." 
        }
    ];

    return (
        <div className="nextgen-landing">
            {/* Ambient Background Elements */}
            <div className="glow-orb" style={{ opacity: 0.3 }}></div>
            
            {/* Floating Glass Navbar */}
            <div className="ng-nav-container">
                <nav className="ng-nav">
                    {/* 1. LOGO */}
                    <div className="ng-logo" onClick={() => navigate('/')}>
                        <Database color="#a371f7" size={24} /> 
                        <span>RevBase</span>
                    </div>

                    {/* 2. LINKS */}
                    <div className="ng-nav-links">
                        <span className="active-nav-link">Features</span>
                        <span onClick={() => navigate('/ai')}>RevPilot AI</span>
                        <span onClick={() => navigate('/docs')}>Documentation</span>
                        <span onClick={() => navigate('/pricing')}>Pricing</span>
                    </div>

                    {/* 3. AUTH WRAPPER - Correctly aligned via Landing.css */}
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

            {/* Main Content */}
            <main className="ng-hero">
                <h1 className="ng-title">
                    Built for <br/>
                    <span className="ng-title-accent">Data Science.</span>
                </h1>
                
                <p className="ng-subtitle">
                    Stop losing track of your computer vision datasets and ML models. 
                    RevBase brings Git-like version control to your structured data.
                </p>
                
                {/* Features Grid - Uses class-based styling for consistency */}
                <div className="ng-features-grid">
                    {featuresList.map((feat, i) => (
                        <div key={i} className="ng-feature-card">
                            <div style={{ marginBottom: '20px' }}>{feat.icon}</div>
                            <h3>{feat.title}</h3>
                            <p>{feat.desc}</p>
                        </div>
                    ))}
                </div>

                <footer className="ng-footer">
                    <div className="ng-footer-line"></div>
                    <p>© 2026 RevBase Systems | AI Research Division</p>
                </footer>
            </main>
        </div>
    );
};

export default Features;