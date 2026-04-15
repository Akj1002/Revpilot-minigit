import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Code2, GitBranch, Settings, History, Cpu } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <Code2 size={20}/>, label: 'Code', path: '/' },
        { icon: <GitBranch size={20}/>, label: 'Branches', path: '/branches' },
        { icon: <Cpu size={20}/>, label: 'RevPilot', path: '/ai-settings' },
        { icon: <Settings size={20}/>, label: 'Settings', path: '/settings' },
    ];

    return (
        <div style={{ width: '60px', backgroundColor: '#0d1117', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '20px' }}>
            {menuItems.map((item) => (
                <div 
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{ 
                        cursor: 'pointer', 
                        color: location.pathname === item.path ? '#2f81f7' : '#8b949e',
                        transition: 'color 0.2s'
                    }}
                    title={item.label}
                >
                    {item.icon}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;