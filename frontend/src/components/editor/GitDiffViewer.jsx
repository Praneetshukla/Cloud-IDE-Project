import { useSelector, useDispatch } from 'react-redux';
import { DiffEditor } from '@monaco-editor/react';
import LoadingSpinner from '../common/LoadingSpinner';
import { clearActiveDiff } from '../../redux/slices/gitSlice';
import { HiOutlineX } from 'react-icons/hi';

const GitDiffViewer = () => {
  const dispatch = useDispatch();
  const { activeDiff } = useSelector(state => state.git);
  const { preferences } = useSelector(state => state.settings);

  if (!activeDiff) return null;

  return (
    <div className="flex-1 flex flex-col w-full h-full relative bg-[#1e1e1e] overflow-hidden">
      <div className="h-10 bg-[#2d2d2d] border-b border-[#3c3c3c] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-indigo-400 font-mono mr-2">{activeDiff.fileName}</span>
          <span className="text-gray-400">Last Commit</span>
          <span className="text-gray-500 font-bold">↔</span>
          <span className="text-gray-400">Current Changes</span>
        </div>
        <button 
          onClick={() => dispatch(clearActiveDiff())}
          className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
        >
          <HiOutlineX className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 relative">
        <DiffEditor
          height="100%"
          language={activeDiff.language || 'plaintext'}
          original={activeDiff.originalContent || ''}
          modified={activeDiff.modifiedContent || ''}
          theme={preferences?.theme || 'vs-dark'}
          loading={<LoadingSpinner />}
          options={{
            renderSideBySide: true,
            readOnly: true,
            minimap: { enabled: false },
            fontSize: preferences?.fontSize || 14,
            fontFamily: "'Fira Code', 'Consolas', monospace",
          }}
        />
      </div>
    </div>
  );
};

export default GitDiffViewer;
