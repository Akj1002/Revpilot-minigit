import React, { useState } from 'react';
import { GitBranch, GitMerge, Plus, Clock, User, CheckCircle2, GitPullRequest, Loader2 } from 'lucide-react';

const Branches = () => {
    // Dynamic State for Branches!
    const [branches, setBranches] = useState([
        { id: 1, name: 'main', status: 'Default', updated: 'Just now', author: 'Abhinav', commitsAhead: 0, isDefault: true },
        { id: 2, name: 'experimental-model', status: 'Active', updated: '4 hours ago', author: 'Abhinav', commitsAhead: 12, isDefault: false },
    ]);
    
    const [isCreating, setIsCreating] = useState(false);

    // The working "New Branch" function
    const handleNewBranch = () => {
        const branchName = prompt("Enter new branch name (e.g., feature/data-clean):");
        if (!branchName) return;

        setIsCreating(true);
        
        // Simulate backend branch creation delay
        setTimeout(() => {
            const newBranch = {
                id: Date.now(),
                name: branchName.toLowerCase().replace(/\s+/g, '-'),
                status: 'Active',
                updated: 'Just now',
                author: 'Abhinav',
                commitsAhead: 0,
                isDefault: false
            };
            setBranches([newBranch, ...branches]);
            setIsCreating(false);
        }, 1000);
    };

    const handleMerge = (id, name) => {
        if(window.confirm(`Are you sure you want to merge '${name}' into main?`)) {
            setBranches(branches.filter(b => b.id !== id));
            alert(`Successfully merged ${name}!`);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%', height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <GitBranch color="#a371f7" size={36} /> Branches
                    </h1>
                    <p style={{ color: '#8b949e', margin: 0, fontSize: '1rem' }}>Manage your dataset timelines and neural experiments.</p>
                </div>
                <button 
                    onClick={handleNewBranch} 
                    disabled={isCreating}
                    style={{ background: '#238636', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: isCreating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {isCreating ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} 
                    {isCreating ? 'Creating...' : 'New Branch'}
                </button>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '16px 24px', background: '#161b22', borderBottom: '1px solid #30363d', fontSize: '12px', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase' }}>
                    <div>Branch Name</div>
                    <div>Author</div>
                    <div>Status</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                {branches.map((branch, idx) => (
                    <div key={branch.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '20px 24px', borderBottom: idx !== branches.length - 1 ? '1px solid #30363d' : 'none', alignItems: 'center', transition: 'background 0.2s' }}>
                        
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <GitBranch size={16} color={branch.isDefault ? '#3fb950' : '#8b949e'} />
                                <span style={{ fontSize: '16px', fontWeight: '600', color: '#58a6ff' }}>{branch.name}</span>
                                {branch.isDefault && <span style={{ background: 'rgba(46, 160, 67, 0.15)', color: '#3fb950', border: '1px solid rgba(46, 160, 67, 0.4)', fontSize: '10px', padding: '2px 8px', borderRadius: '12px' }}>Default</span>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b949e', fontSize: '12px' }}>
                                <Clock size={12} /> Updated {branch.updated}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c9d1d9', fontSize: '13px' }}>
                            <User size={14} color="#8b949e" /> {branch.author}
                        </div>

                        <div>
                            <div style={{ fontSize: '13px', color: '#c9d1d9', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {branch.commitsAhead > 0 ? (
                                    <><GitPullRequest size={14} color="#a371f7" /> {branch.commitsAhead} commits ahead</>
                                ) : (
                                    <><CheckCircle2 size={14} color="#3fb950" /> Up to date</>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            {!branch.isDefault && (
                                <button onClick={() => handleMerge(branch.id, branch.name)} style={{ background: 'rgba(163, 113, 247, 0.1)', border: '1px solid rgba(163, 113, 247, 0.3)', color: '#a371f7', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <GitMerge size={14} /> Merge
                                </button>
                            )}
                            <button onClick={() => alert(`Switched to branch: ${branch.name}`)} style={{ background: 'transparent', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                Switch
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Branches;