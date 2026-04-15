import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepoStore } from '../store/useRepoStore';
import { Mail, Lock, ArrowRight, Loader2, KeyRound, Fingerprint, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const Auth = () => {
    const navigate = useNavigate();

    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('login'); 
    const [otp, setOtp] = useState('');

    const login = useRepoStore((state) => state.login);

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            const mockUser = { 
                id: '65f0a2b9c3d4e5f6a7b8c9d0', 
                name: view === 'signup' ? name || 'New User' : 'Test User', 
                email: email 
            };
            login(mockUser, 'mock-token-123');
            setIsLoading(false);
            navigate('/dashboard');
        }, 1000);
    };

    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:5000/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential: tokenResponse.access_token }),
                });
                
                const data = await res.json();
                if (res.ok) {
                    login(data.user, data.token); 
                    navigate('/dashboard');
                } else {
                    alert('Google verification failed.');
                }
            } catch (err) {
                console.error(err);
                alert('Network error connecting to backend.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => console.log('Google Login Failed')
    });

    // --- OTP FLOW FUNCTIONS ---
    const sendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                setView('otp');
            } else {
                alert('Failed to send OTP. Check backend connection.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            if (response.ok) {
                setView('reset');
            } else {
                alert('Invalid Code. Please try again.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTitle = () => {
        if (view === 'login') return 'Welcome to RevBase';
        if (view === 'signup') return 'Create an Account';
        if (view === 'forgot') return 'Reset Password';
        if (view === 'otp') return 'Enter OTP';
        if (view === 'reset') return 'New Password';
    };

    const getSubtitle = () => {
        if (view === 'login') return 'Sign in to access your neural workspace.';
        if (view === 'signup') return 'Sign up to initialize your first neural mesh.';
        if (view === 'forgot') return 'We will send a secure code to your email.';
        if (view === 'otp') return 'Enter the 6-digit code sent to your email.';
        if (view === 'reset') return 'Enter a strong new password for your account.';
    };

    return (
        <div style={{ 
            position: 'absolute', inset: 0, 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            backgroundColor: '#010409',
            backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(47, 129, 247, 0.15), transparent)', 
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}></div>

            <div style={{ 
                background: 'rgba(13, 17, 23, 0.7)', 
                backdropFilter: 'blur(16px)', 
                border: '1px solid rgba(48, 54, 61, 0.5)', 
                borderRadius: '24px', 
                width: '100%', maxWidth: '420px', 
                padding: '48px 40px', 
                boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 20px rgba(163, 113, 247, 0.05)',
                position: 'relative',
                zIndex: 10,
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        width: '56px', height: '56px', borderRadius: '16px', 
                        background: 'linear-gradient(135deg, rgba(47,129,247,0.1), rgba(163,113,247,0.1))',
                        border: '1px solid rgba(163, 113, 247, 0.3)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', 
                        margin: '0 auto 20px',
                        boxShadow: '0 0 20px rgba(163, 113, 247, 0.2)'
                    }}>
                        {(view === 'login' || view === 'signup') ? <Fingerprint color="#a371f7" size={28} /> : <KeyRound color="#2f81f7" size={28} />}
                    </div>
                    <h2 style={{ color: '#f0f6fc', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                        {getTitle()}
                    </h2>
                    <p style={{ color: '#8b949e', margin: 0, fontSize: '15px' }}>
                        {getSubtitle()}
                    </p>
                </div>

                {/* --- LOGIN OR SIGNUP VIEW --- */}
                {(view === 'login' || view === 'signup') && (
                    <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        {view === 'signup' && (
                            <div>
                                <label style={{ display: 'block', color: '#c9d1d9', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} color="#8b949e" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Abhinav Kumar" style={{ width: '100%', background: 'rgba(1, 4, 9, 0.5)', border: '1px solid #30363d', color: '#fff', padding: '12px 12px 12px 42px', borderRadius: '10px', outline: 'none', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                                </div>
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', color: '#c9d1d9', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} color="#8b949e" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" style={{ width: '100%', background: 'rgba(1, 4, 9, 0.5)', border: '1px solid #30363d', color: '#fff', padding: '12px 12px 12px 42px', borderRadius: '10px', outline: 'none', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ color: '#c9d1d9', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                                {view === 'login' && <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: '#a371f7', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Forgot?</button>}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} color="#8b949e" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', background: 'rgba(1, 4, 9, 0.5)', border: '1px solid #30363d', color: '#fff', padding: '12px 12px 12px 42px', borderRadius: '10px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} style={{ background: 'linear-gradient(90deg, #2f81f7, #a371f7)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: isLoading ? 'wait' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '10px', boxShadow: '0 4px 15px rgba(47, 129, 247, 0.3)', transition: 'opacity 0.2s' }}>
                            {isLoading ? <Loader2 size={18} className="spin" /> : <>{view === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: '#30363d' }}></div>
                            <span style={{ color: '#8b949e', fontSize: '12px', padding: '0 12px', fontWeight: '500' }}>OR CONTINUE WITH</span>
                            <div style={{ flex: 1, height: '1px', background: '#30363d' }}></div>
                        </div>

                        {/* Social Buttons - GitHub Removed, Google Centered */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button 
                                type="button" 
                                onClick={() => handleGoogleAuth()} 
                                style={{ 
                                    width: '100%', 
                                    background: 'rgba(22, 27, 34, 0.8)', 
                                    border: '1px solid #30363d', 
                                    color: '#c9d1d9', 
                                    padding: '12px', 
                                    borderRadius: '10px', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: '10px', 
                                    transition: 'background 0.2s' 
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                        </div>
                        
                        {/* TOGGLE SIGNUP / LOGIN */}
                        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#8b949e' }}>
                            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <span onClick={() => setView(view === 'login' ? 'signup' : 'login')} style={{ color: '#58a6ff', cursor: 'pointer', fontWeight: '500' }}>
                                {view === 'login' ? 'Sign up' : 'Sign in'}
                            </span>
                        </div>
                    </form>
                )}

                {/* --- FORGOT PASSWORD (STEP 1: EMAIL) --- */}
                {view === 'forgot' && (
                    <form onSubmit={sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#c9d1d9', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Account Email</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" style={{ width: '100%', background: 'rgba(1, 4, 9, 0.5)', border: '1px solid #30363d', color: '#fff', padding: '12px', borderRadius: '10px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <button type="submit" disabled={isLoading} style={{ background: '#2f81f7', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {isLoading ? <Loader2 size={18} className="spin" /> : 'Send OTP'}
                        </button>
                        <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#8b949e', fontSize: '13px', cursor: 'pointer', marginTop: '-10px' }}>Back to Login</button>
                    </form>
                )}

                {/* --- FORGOT PASSWORD (STEP 2: OTP) --- */}
                {view === 'otp' && (
                    <form onSubmit={verifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#c9d1d9', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>6-Digit Code</label>
                            <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6} style={{ width: '100%', background: 'rgba(1, 4, 9, 0.5)', border: '1px solid #30363d', color: '#fff', padding: '14px', borderRadius: '10px', outline: 'none', textAlign: 'center', letterSpacing: '8px', fontSize: '20px', boxSizing: 'border-box' }} />
                        </div>
                        <button type="submit" disabled={isLoading} style={{ background: '#238636', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {isLoading ? <Loader2 size={18} className="spin" /> : 'Verify Code'}
                        </button>
                    </form>
                )}

                {/* --- FORGOT PASSWORD (STEP 3: RESET) --- */}
                {view === 'reset' && (
                    <form onSubmit={() => setView('login')} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <input type="password" required placeholder="New Password" style={{ width: '100%', background: 'rgba(1, 4, 9, 0.5)', border: '1px solid #30363d', color: '#fff', padding: '12px', borderRadius: '10px', outline: 'none', boxSizing: 'border-box' }} />
                        <button type="submit" style={{ background: '#a371f7', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                            Save New Password
                        </button>
                    </form>
                )}
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } input:focus { border-color: #2f81f7 !important; }`}</style>
        </div>
    );
};

export default Auth;