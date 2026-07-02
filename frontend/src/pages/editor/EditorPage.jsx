import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineMenu, HiOutlineCode, HiOutlinePlay, HiOutlineTerminal, HiOutlineSparkles, HiOutlineCog } from 'react-icons/hi';
import { VscFiles, VscSourceControl } from 'react-icons/vsc';
import { fetchProjectTree, resetFileSystem, openFile } from '../../redux/slices/fileSystemSlice';
import { executeFile, toggleTerminal } from '../../redux/slices/terminalSlice';
import { fetchRepository } from '../../redux/slices/gitSlice';
import { fetchChatHistory } from '../../redux/slices/aiSlice';
import { fetchSettings, toggleSettingsModal } from '../../redux/slices/settingsSlice';
import FileTree from '../../components/editor/FileTree';
import SourceControl from '../../components/editor/SourceControl';
import AIPanel from '../../components/editor/AIPanel';
import EditorTabs from '../../components/editor/EditorTabs';
import CodeEditor from '../../components/editor/CodeEditor';
import TerminalPanel from '../../components/editor/TerminalPanel';
import SettingsModal from '../../components/editor/SettingsModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { cn } from '../../utils/helpers';

const EditorPage = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { folders, files, isLoading: fsLoading, activeFileId, openFiles } = useSelector(state => state.fileSystem);
  const { isExecuting } = useSelector(state => state.terminal);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'git' | 'ai'

  useEffect(() => {
    dispatch(fetchSettings()); // Load user preferences
    
    if (projectId) {
      dispatch(fetchProjectTree(projectId));
      dispatch(fetchRepository(projectId));
      dispatch(fetchChatHistory(projectId));
    }
    return () => {
      dispatch(resetFileSystem());
    };
  }, [dispatch, projectId]);

  const handleFileClick = (file) => {
    dispatch(openFile(file));
  };

  const handleRunCode = () => {
    if (!activeFileId || isExecuting) return;
    dispatch(executeFile({ projectId, fileId: activeFileId }));
  };

  const activeFile = openFiles.find(f => f._id === activeFileId);
  const canRun = activeFile && (activeFile.name.endsWith('.js') || activeFile.name.endsWith('.py'));

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[var(--color-bg-primary)] relative">
      <SettingsModal />
      
      {/* Activity Bar (Far Left) */}
      <div className="w-12 h-full bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col items-center py-4 z-30 shrink-0">
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              if (activeTab === 'explorer' && sidebarOpen) setSidebarOpen(false);
              else {
                setActiveTab('explorer');
                setSidebarOpen(true);
              }
            }}
            className={cn(
              "p-2 rounded-xl transition-all",
              activeTab === 'explorer' && sidebarOpen ? "text-white bg-indigo-500/20" : "text-slate-500 hover:text-slate-300"
            )}
            title="Explorer"
          >
            <VscFiles className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => {
              if (activeTab === 'git' && sidebarOpen) setSidebarOpen(false);
              else {
                setActiveTab('git');
                setSidebarOpen(true);
              }
            }}
            className={cn(
              "p-2 rounded-xl transition-all relative",
              activeTab === 'git' && sidebarOpen ? "text-white bg-indigo-500/20" : "text-slate-500 hover:text-slate-300"
            )}
            title="Source Control"
          >
            <VscSourceControl className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => {
              if (activeTab === 'ai' && sidebarOpen) setSidebarOpen(false);
              else {
                setActiveTab('ai');
                setSidebarOpen(true);
              }
            }}
            className={cn(
              "p-2 rounded-xl transition-all relative",
              activeTab === 'ai' && sidebarOpen ? "text-indigo-400 bg-indigo-500/20" : "text-slate-500 hover:text-indigo-300"
            )}
            title="Orbit AI Assistant"
          >
            <HiOutlineSparkles className="h-6 w-6" />
          </button>
        </div>

        {/* Bottom Activity Bar Actions */}
        <div className="mt-auto flex flex-col gap-4">
          <button
            onClick={() => dispatch(toggleSettingsModal())}
            className="p-2 rounded-xl text-slate-500 hover:text-white transition-all"
            title="Settings"
          >
            <HiOutlineCog className="h-6 w-6" />
          </button>
        </div>

      </div>

      {/* Left Sidebar */}
      <div 
        className={`h-full shrink-0 transition-all duration-300 ease-in-out z-20 ${
          sidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className="h-full w-64 border-r border-[var(--color-border)] overflow-hidden">
          {activeTab === 'explorer' ? (
            <FileTree 
              projectId={projectId} 
              folders={folders} 
              files={files} 
              onFileClick={handleFileClick} 
            />
          ) : activeTab === 'git' ? (
            <SourceControl projectId={projectId} />
          ) : (
            <AIPanel projectId={projectId} />
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-[var(--color-bg-primary)] relative z-10">
        
        {/* Editor Top Navbar */}
        <div className="h-12 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center px-4 gap-4 shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
          >
            <HiOutlineMenu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
            <span className="font-semibold text-indigo-400">Orbit</span>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            
            {/* Terminal Toggle Button */}
            <button 
              onClick={() => dispatch(toggleTerminal())}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
              title="Toggle Terminal"
            >
              <HiOutlineTerminal className="h-5 w-5" />
            </button>

            {/* Run Button */}
            <button
              onClick={handleRunCode}
              disabled={!canRun || isExecuting}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                !canRun 
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' 
                  : isExecuting
                    ? 'bg-amber-500/20 text-amber-400 cursor-wait'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 cursor-pointer shadow-[0_0_10px_rgba(74,222,128,0.1)]'
              }`}
            >
              <HiOutlinePlay className="h-4 w-4" />
              {isExecuting ? 'Running...' : 'Run'}
            </button>

            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />

            <button 
              onClick={() => navigate('/dashboard')}
              className="text-xs font-medium bg-[var(--color-bg-tertiary)] hover:bg-indigo-500/20 hover:text-indigo-400 text-[var(--color-text-secondary)] px-3 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <EditorTabs />

        {/* Editor Content Area */}
        <div className="flex-1 relative flex items-center justify-center bg-[var(--color-bg-primary)] min-h-0">
          {fsLoading && !folders.length && !files.length ? (
            <LoadingSpinner />
          ) : activeFileId ? (
            <CodeEditor />
          ) : (
             <div className="text-center animate-fade-in-up">
               <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/5">
                 <HiOutlineCode className="h-10 w-10 text-indigo-400" />
               </div>
               <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Orbit Editor</h2>
               <p className="text-sm text-[var(--color-text-secondary)] mt-2">Select a file from the explorer to start editing.</p>
             </div>
          )}
        </div>

        {/* Terminal Panel (Bottom) */}
        <TerminalPanel />

      </div>

    </div>
  );
};

export default EditorPage;
