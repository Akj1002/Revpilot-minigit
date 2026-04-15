import React from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

const RevPilot = () => {
    return (
        <div style={{ padding: '40px', maxWidth: '800px' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Sparkles color="#a371f7" /> RevPilot AI
            </h1>

            <p style={{ color: '#8b949e' }}>Powered by Google Gemini Pro Vision Engine</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                <div style={{ padding: '20px', border: '1px solid #30363d', borderRadius: '8px', backgroundColor: '#0d1117' }}>
                    <Zap size={24} color="#e3b341" />
                    <h3 style={{ margin: '15px 0 10px 0' }}>Data Autocomplete</h3>
                    <p style={{ fontSize: '13px', color: '#8b949e' }}>AI will suggest the next JSON blocks based on your previous data patterns.</p>
                    <div style={{ color: '#238636', fontSize: '12px', marginTop: '10px' }}>● Active</div>
                </div>

                <div style={{ padding: '20px', border: '1px solid #30363d', borderRadius: '8px', backgroundColor: '#0d1117' }}>
                    <ShieldCheck size={24} color="#2f81f7" />
                    <h3 style={{ margin: '15px 0 10px 0' }}>Schema Validation</h3>
                    <p style={{ fontSize: '13px', color: '#8b949e' }}>Ensures AI suggestions strictly follow your current dataset schema.</p>
                    <div style={{ color: '#8b949e', fontSize: '12px', marginTop: '10px' }}>● Optional</div>
                </div>
            </div>
        </div>
    );
};

export default RevPilot;