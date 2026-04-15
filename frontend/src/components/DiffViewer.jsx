import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useRepoStore } from '../store/useRepoStore';

const DiffViewer = () => {
    const { baseData, currentData } = useRepoStore();
    return (
        <div style={{ border: '1px solid #ddd', overflow: 'hidden', flexGrow: 1, minHeight: '400px' }}>
            <ReactDiffViewer 
                oldValue={JSON.stringify(baseData, null, 2)} 
                newValue={JSON.stringify(currentData, null, 2)} 
                splitView={true} useDarkTheme={false}
                leftTitle="Base State" rightTitle="Draft State"
            />
        </div>
    );
};
export default DiffViewer;