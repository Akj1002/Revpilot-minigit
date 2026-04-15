import React, { useState, useEffect } from 'react';
import { useRepoStore } from '../store/useRepoStore';
import { getAutocompleteSuggestion } from '../utils/revPilot';
import { Sparkles, Loader2 } from 'lucide-react';

const JsonEditor = () => {
    const { currentData, updateData } = useRepoStore();
    const [jsonInput, setJsonInput] = useState("");
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        setJsonInput(JSON.stringify(currentData, null, 2));
    }, [currentData]);

    const handleJsonChange = (e) => {
        setJsonInput(e.target.value);
        try {
            updateData(JSON.parse(e.target.value));
        } catch (err) {} 
    };

    const triggerAi = async () => {
        setIsSuggesting(true);
        const suggestion = await getAutocompleteSuggestion(jsonInput);
        if (suggestion) {
            // Very basic insertion: append to the end before the last closing bracket
            const lastBracketIndex = jsonInput.lastIndexOf(']');
            if (lastBracketIndex !== -1) {
                const updated = jsonInput.slice(0, lastBracketIndex) + 
                                (jsonInput.trim().endsWith('[') ? "" : ",\n  ") + 
                                suggestion + 
                                "\n" + jsonInput.slice(lastBracketIndex);
                setJsonInput(updated);
                try { updateData(JSON.parse(updated)); } catch (e) {}
            } else {
                setJsonInput(jsonInput + "\n" + suggestion);
            }
        }
        setIsSuggesting(false);
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                zIndex: 5,
                display: 'flex',
                gap: '8px'
            }}>
                <button 
                    onClick={triggerAi}
                    disabled={isSuggesting}
                    style={{ 
                        backgroundColor: '#a371f7', 
                        color: 'white', 
                        fontSize: '11px', 
                        padding: '4px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        border: 'none',
                        boxShadow: '0 0 10px rgba(163, 113, 247, 0.3)'
                    }}
                >
                    {isSuggesting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    RevPilot (Ctrl+Space)
                </button>
            </div>
            
            <textarea 
                style={{ 
                    width: '100%', 
                    flexGrow: 1, 
                    backgroundColor: '#010409', 
                    color: '#79c0ff', 
                    padding: '20px', 
                    fontFamily: 'JetBrains Mono, monospace', 
                    fontSize: '13px',
                    border: 'none',
                    outline: 'none',
                    resize: 'none'
                }}
                value={jsonInput}
                onChange={handleJsonChange}
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.code === 'Space') {
                        e.preventDefault();
                        triggerAi();
                    }
                }}
            />
        </div>
    );
};

export default JsonEditor;