import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Check, Zap } from 'lucide-react';
import '../Landing.css';

const Pricing = () => {
    const navigate = useNavigate();
    const tiers = [
        { name: "Hobby", price: "$0", desc: "For students and solo devs.", features: ["3 Private Repositories", "JSON Versioning", "Community Support"] },
        { name: "Pro", price: "$15", desc: "For researchers and ML engineers.", popular: true, features: ["Unlimited Repositories", "RevPilot AI Access", "Neural Mesh Editor", "Priority Sync"] },
        { name: "Enterprise", price: "Custom", desc: "For massive data pipelines.", features: ["Dedicated Instances", "SLA Guarantee", "Advanced Security Guardrails"] }
    ];

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
                        <span className="active-nav-link">Pricing</span>
                    </div>
                    <div className="ng-auth-wrapper">
                        <button className="ng-btn-login" onClick={() => navigate('/auth')}>Log in</button>
                        <button className="ng-btn-signup" onClick={() => navigate('/auth')}>Sign Up</button>
                    </div>
                </nav>
            </div>

            <main className="ng-hero">
                <div className="ng-badge">
                    <Zap size={16} fill="#a371f7" /> 14-day free trial on all Pro plans
                </div>

                <h1 className="ng-title">
                    Scale your <br/>
                    <span className="ng-title-accent">Intelligence.</span>
                </h1>
                
                <p className="ng-subtitle">
                    Choose the plan that fits your research needs. From solo 
                    exploration to enterprise-grade neural deployment.
                </p>

                {/* Pricing Grid */}
                <div className="ng-features-grid" style={{ 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    marginTop: '20px' 
                }}>
                    {tiers.map((tier, i) => (
                        <div key={i} className="ng-feature-card" style={{ 
                            position: 'relative',
                            border: tier.popular ? '1px solid rgba(163, 113, 247, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: tier.popular ? 'rgba(163, 113, 247, 0.03)' : 'rgba(255, 255, 255, 0.02)'
                        }}>
                            {tier.popular && (
                                <div style={{ 
                                    position: 'absolute', top: '20px', right: '20px', 
                                    background: '#a371f7', color: 'white', fontSize: '10px', 
                                    fontWeight: '800', padding: '4px 10px', borderRadius: '4px' 
                                }}>
                                    POPULAR
                                </div>
                            )}
                            
                            <h3 style={{ fontSize: '1.1rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {tier.name}
                            </h3>
                            
                            <div style={{ fontSize: '3rem', fontWeight: '800', margin: '15px 0' }}>
                                {tier.price}
                                {tier.price !== "Custom" && <span style={{ fontSize: '1rem', color: '#484f58' }}>/mo</span>}
                            </div>
                            
                            <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '30px', minHeight: '40px' }}>
                                {tier.desc}
                            </p>

                            <button 
                                className={tier.popular ? "ng-btn-primary" : "ng-btn-secondary"} 
                                onClick={() => navigate('/auth')}
                                style={{ width: '100%', justifyContent: 'center', marginBottom: '32px' }}
                            >
                                Get Started
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {tier.features.map((f, j) => (
                                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#c9d1d9' }}>
                                        <Check size={18} color="#27c93f" /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="ng-footer">
                    <div className="ng-footer-line"></div>
                    <p>© 2026 RevBase Systems | Secure Neural Infrastructure</p>
                </footer>
            </main>
        </div>
    );
};

export default Pricing;