import React from 'react';
import { Trash2, ShieldAlert } from 'lucide-react';

const Settings = () => {
    return (
        <div style={{ padding: '40px', maxWidth: '800px' }}>
            <h1>Repository Settings</h1>

            <div style={{ marginTop: '40px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f85149' }}>
                    <ShieldAlert size={20} /> Danger Zone
                </h3>
                <div style={{ border: '1px solid #f85149', borderRadius: '6px', padding: '20px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>Delete this repository</strong>
                            <div style={{ fontSize: '12px', color: '#8b949e' }}>All history and commits will be permanently removed.</div>
                        </div>
                        <button style={{ backgroundColor: '#21262d', color: '#f85149', borderColor: '#f85149' }}>
                            <Trash2 size={16} style={{marginRight: '8px'}}/> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;