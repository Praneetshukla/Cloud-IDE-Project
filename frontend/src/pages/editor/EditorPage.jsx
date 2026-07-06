import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineMenu, HiOutlineCode, HiOutlinePlay, HiOutlineTerminal, HiOutlineSparkles, HiOutlineCog, HiOutlineLink } from 'react-icons/hi';
import { VscFiles, VscSourceControl } from 'react-icons/vsc';
import { fetchProjectTree, resetFileSystem, openFile, setInitialOpenFiles } from '../../redux/slices/fileSystemSlice';
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
import GitDiffViewer from '../../components/editor/GitDiffViewer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MatrixGridBackground } from '../../components/common/MatrixGridBackground';
import { cn } from '../../utils/helpers';
import useAuth from '../../hooks/useAuth';
import { useSocket } from '../../contexts/SocketContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EditorPage = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();

  const { folders, files, isLoading: fsLoading, activeFileId, openFiles, fileContents } = useSelector(state => state.fileSystem);
  const { isExecuting } = useSelector(state => state.terminal);
  const { activeDiff } = useSelector(state => state.git);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('explorer');
  const [activeUsers, setActiveUsers] = useState([]);
  const hasLoadedFromStorage = useRef(false);

  useEffect(() => {
    dispatch(fetchSettings());

    if (projectId) {
      dispatch(fetchProjectTree(projectId));
      dispatch(fetchRepository(projectId));
      dispatch(fetchChatHistory(projectId));
      
      const savedOpenFiles = localStorage.getItem(`IDE_OPEN_FILES_${projectId}`);
      const savedActiveFileId = localStorage.getItem(`IDE_ACTIVE_FILE_${projectId}`);
      if (savedOpenFiles) {
        try {
          const parsedOpenFiles = JSON.parse(savedOpenFiles);
          if (parsedOpenFiles && parsedOpenFiles.length > 0) {
            dispatch(setInitialOpenFiles({
              openFiles: parsedOpenFiles,
              activeFileId: savedActiveFileId && savedActiveFileId !== 'null' ? savedActiveFileId : null
            }));
          }
        } catch (e) {
          console.error("Failed to parse saved open files", e);
        }
      }
      hasLoadedFromStorage.current = true;
    }
    return () => {
      dispatch(resetFileSystem());
    };
  }, [dispatch, projectId]);

  // Persist open tabs and active file to localStorage
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (projectId && hasLoadedFromStorage.current) {
      if (openFiles.length > 0) {
        localStorage.setItem(`IDE_OPEN_FILES_${projectId}`, JSON.stringify(openFiles));
      } else {
        localStorage.removeItem(`IDE_OPEN_FILES_${projectId}`);
      }
    }
  }, [projectId, openFiles]);

  const isInitialMountForActiveFile = useRef(true);
  useEffect(() => {
    if (isInitialMountForActiveFile.current) {
      isInitialMountForActiveFile.current = false;
      return;
    }
    if (projectId && hasLoadedFromStorage.current) {
      if (activeFileId) {
        localStorage.setItem(`IDE_ACTIVE_FILE_${projectId}`, activeFileId);
      } else {
        localStorage.removeItem(`IDE_ACTIVE_FILE_${projectId}`);
      }
    }
  }, [projectId, activeFileId]);

  // Socket.io: Join Project Room
  useEffect(() => {
    if (!socket || !projectId || !user) return;

    socket.emit('join-project', { projectId, user });

    const handleActiveUsers = (users) => {
      setActiveUsers(users);
    };

    const handleProjectReverted = () => {
      window.__isReverting = true;
      toast('Project reverted by collaborator. Reloading...', { icon: '🔄' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    };

    socket.on('active-users', handleActiveUsers);
    socket.on('project-reverted', handleProjectReverted);

    return () => {
      socket.off('active-users', handleActiveUsers);
      socket.off('project-reverted', handleProjectReverted);
    };
  }, [socket, projectId, user]);

  const activeFile = openFiles.find(f => f._id === activeFileId);

  // Emit active file to socket for presence indicators
  useEffect(() => {
    if (socket && projectId) {
      socket.emit('user-active-file', {
        projectId,
        fileId: activeFileId || null,
        fileName: activeFile ? activeFile.name : null
      });
    }
  }, [socket, projectId, activeFileId, activeFile]);

  const handleFileClick = (file) => {
    dispatch(openFile(file));
  };

  const handleRunCode = () => {
    if (!activeFileId || isExecuting) return;
    const content = fileContents[activeFileId];
    dispatch(executeFile({ projectId, fileId: activeFileId, content }));
  };

  const handleShareProject = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/invite`);
      const { token } = response.data.data;
      const inviteUrl = `${window.location.origin}/invite/${token}`;
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invite link copied to clipboard!', { icon: '🔗' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate invite link');
    }
  };


  const canRun = activeFile && (activeFile.name.endsWith('.js') || activeFile.name.endsWith('.py'));

  return (
    <div className="h-screen w-full flex overflow-hidden bg-transparent relative p-4 gap-4">
      <MatrixGridBackground />
      <SettingsModal />

      {/* Activity Bar */}
      <div className="w-14 h-full bg-surface/20 backdrop-blur-3xl border border-white/10 rounded-2xl flex flex-col items-center py-4 z-30 shrink-0 shadow-[0_0_30px_rgba(6,182,212,0.05),inset_0_0_20px_rgba(255,255,255,0.02)]">
        <div className="flex flex-col gap-4">
          <button onClick={() => { if (activeTab === 'explorer' && sidebarOpen) setSidebarOpen(false); else { setActiveTab('explorer'); setSidebarOpen(true); } }} className={cn("p-2 rounded-xl transition-all", activeTab === 'explorer' && sidebarOpen ? "text-white bg-indigo-500/20" : "text-slate-500 hover:text-slate-300")} title="Explorer"><VscFiles className="h-6 w-6" /></button>
          <button onClick={() => { if (activeTab === 'git' && sidebarOpen) setSidebarOpen(false); else { setActiveTab('git'); setSidebarOpen(true); } }} className={cn("p-2 rounded-xl transition-all relative", activeTab === 'git' && sidebarOpen ? "text-white bg-indigo-500/20" : "text-slate-500 hover:text-slate-300")} title="Source Control"><VscSourceControl className="h-6 w-6" /></button>
          <button onClick={() => { if (activeTab === 'ai' && sidebarOpen) setSidebarOpen(false); else { setActiveTab('ai'); setSidebarOpen(true); } }} className={cn("p-2 rounded-xl transition-all relative", activeTab === 'ai' && sidebarOpen ? "text-indigo-400 bg-indigo-500/20" : "text-slate-500 hover:text-indigo-300")} title="Orbit AI Assistant"><HiOutlineSparkles className="h-6 w-6" /></button>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <button onClick={() => dispatch(toggleSettingsModal())} className="p-2 rounded-xl text-slate-500 hover:text-white transition-all" title="Settings"><HiOutlineCog className="h-6 w-6" /></button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className={`h-full shrink-0 transition-all duration-300 ease-in-out z-20 ${sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
        <div className="h-full w-full bg-surface/20 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)]">
          {activeTab === 'explorer' ? <FileTree projectId={projectId} folders={folders} files={files} onFileClick={handleFileClick} activeUsers={activeUsers} /> : activeTab === 'git' ? <SourceControl projectId={projectId} /> : <AIPanel projectId={projectId} />}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-surface/10 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden relative z-10 shadow-[0_0_40px_rgba(139,92,246,0.05)]">

        {/* Editor Top Navbar */}
        <div className="h-12 border-b border-white/10 bg-surface/20 flex items-center px-4 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-cyan-400/70 hover:text-cyan-300 rounded-md hover:bg-cyan-500/10 transition-colors cursor-pointer"><HiOutlineMenu className="h-5 w-5" /></button>
          <div className="flex items-center text-sm text-[var(--color-text-secondary)]"><span className="font-semibold text-indigo-400">Orbit</span></div>

          <div className="ml-auto flex items-center gap-3">

            {/* Live Collaborators Avatars */}
            <div className="flex items-center -space-x-2 mr-2">
              {activeUsers.map((u) => (
                <div
                  key={u.socketId}
                  className="w-7 h-7 rounded-full border-2 border-surface/20 flex items-center justify-center text-[10px] font-bold text-white shadow-md relative group cursor-help"
                  style={{ backgroundColor: u.color }}
                >
                  {u.name.charAt(0).toUpperCase()}
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 flex flex-col items-center">
                    <span className="font-semibold">{u.name}</span>
                    {u.activeFileName && (
                      <span className="text-gray-400 text-[10px]">Viewing: {u.activeFileName}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleShareProject} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all cursor-pointer shadow-[0_0_10px_rgba(99,102,241,0.1)]"><HiOutlineLink className="h-4 w-4" />Share</button>
            <button onClick={() => dispatch(toggleTerminal())} className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer" title="Toggle Terminal"><HiOutlineTerminal className="h-5 w-5" /></button>
            <button onClick={handleRunCode} disabled={!canRun || isExecuting} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${!canRun ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' : isExecuting ? 'bg-amber-500/20 text-amber-400 cursor-wait' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 cursor-pointer shadow-[0_0_10px_rgba(74,222,128,0.1)]'}`}><HiOutlinePlay className="h-4 w-4" />{isExecuting ? 'Running...' : 'Run'}</button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button onClick={() => navigate('/dashboard')} className="text-xs font-bold tracking-widest uppercase bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-500/20 hover:text-cyan-300 text-cyan-400/80 px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-[inset_0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]">Exit</button>
          </div>
        </div>

        {/* Tabs Bar */}
        <EditorTabs />

        {/* Editor Content Area */}
        <div className="flex-1 relative flex items-center justify-center bg-transparent min-h-0">
          {activeDiff ? (
            <GitDiffViewer />
          ) : fsLoading && !folders.length && !files.length ? (
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
