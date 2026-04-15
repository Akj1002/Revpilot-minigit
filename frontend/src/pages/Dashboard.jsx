import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepoStore } from '../store/useRepoStore';
import { 
    Database, GitCommit, Activity, Cpu, Plus, 
    GitBranch, Clock, AlertCircle, Layout, Trash2 
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { repos = [], fetchRepos, user, deleteRepository } = useRepoStore();

    useEffect(() => {
        if (user?.id) fetchRepos(user.id);
    }, [user?.id, fetchRepos]);

    const totalRepos = repos.length;
    const totalCommits = repos.length > 0 ? repos.length * 5 : 0; 
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // --- DELETE REPOSITORY HANDLER ---
    const handleDelete = (e, repoId, repoName) => {
        e.stopPropagation(); // Prevents the click from opening the workspace!
        if (window.confirm(`Are you sure you want to permanently delete "${repoName}"? This action cannot be undone.`)) {
            deleteRepository(repoId);
        }
    };

    return (
        <div style={{ 
            padding: '40px', maxWidth: '1300px', margin: '0 auto', width: '100%', 
            minHeight: '100vh', color: '#c9d1d9', background: '#010409' 
        }}>
            
            {/* --- HEADER SECTION --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-1px', color: '#fff', textTransform: 'uppercase' }}>
                        Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}
                    </h1>
                    <p style={{ color: '#8b949e', margin: 0, fontSize: '1rem' }}>
                        Monitoring neural activity for <b>{user?.email}</b>
                    </p>
                </div>
                
                <button 
                    onClick={() => navigate('/new')}
                    style={{ 
                        background: '#238636', color: 'white', border: 'none', 
                        padding: '12px 24px', borderRadius: '8px', fontSize: '14px', 
                        fontWeight: '600', cursor: 'pointer', display: 'flex', 
                        alignItems: 'center', gap: '8px', 
                        boxShadow: '0 4px 14px rgba(35, 134, 54, 0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Plus size={18} /> New Repository
                </button>
            </div>

            {/* --- METRICS GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {[
                    { title: 'Active Projects', value: totalRepos, icon: <Database size={20} color="#2f81f7" />, trend: 'Sync: Active' },
                    { title: 'Neural Commits', value: totalCommits, icon: <GitCommit size={20} color="#27c93f" />, trend: 'Estimated Ops' },
                    { title: 'RevPilot Status', value: '1,042', icon: <Cpu size={20} color="#a371f7" />, trend: 'Healthy' },
                    { title: 'Integrity', value: '99.9%', icon: <Activity size={20} color="#ffbd2e" />, trend: 'Optimal' }
                ].map((stat, idx) => (
                    <div key={idx} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: '#8b949e', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>{stat.title}</span>
                            {stat.icon}
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: '12px', color: '#2ea043', marginTop: '8px', fontWeight: '500' }}>● {stat.trend}</div>
                    </div>
                ))}
            </div>

            {/* --- MAIN CONTENT LAYOUT --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Left: Repositories List */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', marginBottom: '20px' }}>
                        <Layout size={18} color="#2f81f7" /> Neural Workspaces
                    </h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {repos.length === 0 ? (
                            <div style={{ background: 'rgba(13, 17, 23, 0.4)', border: '1px dashed #30363d', borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
                                <AlertCircle color="#8b949e" size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <h3 style={{ color: '#fff', marginBottom: '8px' }}>Empty Datastore</h3>
                                <p style={{ color: '#8b949e', fontSize: '14px', maxWidth: '300px', margin: '0 auto 24px' }}>
                                    Initialize a workspace to begin tracking your neural datasets.
                                </p>
                                <button onClick={() => navigate('/new')} style={{ background: '#2f81f7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                                    Initialize First Repo
                                </button>
                            </div>
                        ) : (
                            repos.map((repo) => (
                                <div 
                                    key={repo._id} 
                                    onClick={() => navigate(`/workspace/${repo._id}`)} 
                                    style={{ 
                                        background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', 
                                        padding: '20px', display: 'flex', justifyContent: 'space-between', 
                                        alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s',
                                        position: 'relative'
                                    }} 
                                    onMouseOver={e => {
                                        e.currentTarget.style.borderColor = '#2f81f7';
                                        e.currentTarget.style.background = '#161b22';
                                    }} 
                                    onMouseOut={e => {
                                        e.currentTarget.style.borderColor = '#30363d';
                                        e.currentTarget.style.background = '#0d1117';
                                    }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px 0', color: '#58a6ff' }}>{repo.name}</h3>
                                        <div style={{ display: 'flex', gap: '16px', color: '#8b949e', fontSize: '12px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitBranch size={13} /> main</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {formatDate(repo.createdAt)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons Container */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <button 
                                            onClick={(e) => handleDelete(e, repo._id, repo.name)}
                                            style={{
                                                background: 'transparent', border: 'none', color: '#8b949e', 
                                                cursor: 'pointer', padding: '8px', borderRadius: '6px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'color 0.2s, background 0.2s'
                                            }}
                                            onMouseOver={e => {
                                                e.currentTarget.style.color = '#f85149';
                                                e.currentTarget.style.background = 'rgba(248, 81, 73, 0.1)';
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.color = '#8b949e';
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                            title="Delete Repository"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <ArrowRight size={18} color="#30363d" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Activity & Logs - STICKY AND FIXED HEIGHT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '20px', alignSelf: 'flex-start' }}>
                    
                    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '16px', padding: '24px' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '16px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px' }}>Training Activity</h3>
                        
                        {/* 🛠️ FIXED: Used fixed pixel sizing so it doesn't stretch! */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 18px)', gap: '6px' }}>
                            {Array.from({ length: 40 }).map((_, i) => {
                                const colors = ['#161b22', '#0e4429', '#26a641', '#39d353'];
                                const color = colors[Math.floor(Math.random() * colors.length)];
                                return <div key={i} style={{ width: '18px', height: '18px', backgroundColor: color, borderRadius: '4px' }} />;
                            })}
                        </div>
                    </div>

                    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '16px', padding: '24px' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '16px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px' }}>System Logs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { msg: "RevPilot optimized core.cpp", time: "10m", color: "#a371f7" },
                                { msg: "MongoDB Node Connected", time: "1h", color: "#2ea043" },
                                { msg: "JWT Session Refreshed", time: "2h", color: "#2f81f7" }
                            ].map((log, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: log.color, boxShadow: `0 0 8px ${log.color}` }} />
                                        <span style={{ color: '#c9d1d9' }}>{log.msg}</span>
                                    </div>
                                    <span style={{ color: '#8b949e', fontSize: '11px' }}>{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArrowRight = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

export default Dashboard;