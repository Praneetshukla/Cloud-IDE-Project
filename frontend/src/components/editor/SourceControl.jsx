import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCommit, revertCommit, setActiveDiff } from '../../redux/slices/gitSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { HiOutlineClock, HiOutlineDocumentText, HiOutlineReply } from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const SourceControl = ({ projectId }) => {
  const dispatch = useDispatch();
  const { repository, isLoading, isCommitting } = useSelector(state => state.git);
  const { files, fileContents } = useSelector(state => state.fileSystem);
  const [message, setMessage] = useState('');

  const handleRevert = async (commitId) => {
    if (window.confirm('Are you sure you want to revert? This will overwrite your current files with the state from this commit.')) {
      try {
        await dispatch(revertCommit({ projectId, commitId })).unwrap();
        toast.success('Reverted successfully! Reloading workspace...');

        window.__isReverting = true; // Prevent unmount auto-save from overriding DB

        // Notify other tabs to reload so they don't resurrect dirty Yjs state
        const channel = new BroadcastChannel('orbit-ide-revert');
        channel.postMessage({ type: 'REVERT_SUCCESS', projectId });
        channel.close();

        // We force a full reload so that Redux, Monaco, and the Collaboration WebSocket 
        // all flush their dirty states and pull the clean reverted data from the database.
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (err) {
        toast.error('Failed to revert');
      }
    }
  };

  // Setup BroadcastChannel to handle multi-tab reloads during revert
  useEffect(() => {
    const channel = new BroadcastChannel('orbit-ide-revert');
    channel.onmessage = (event) => {
      if (event.data.type === 'REVERT_SUCCESS' && event.data.projectId === projectId) {
        window.__isReverting = true;
        window.location.reload();
      }
    };
    return () => channel.close();
  }, [projectId]);

  const handleCommit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send the frontend's live file contents so the commit is instant
    const filesData = Object.keys(fileContents).map(id => ({
      fileId: id,
      content: fileContents[id]
    }));

    try {
      await dispatch(createCommit({ projectId, message, filesData })).unwrap();
      setMessage('');
      toast.success('Commit created successfully');
    } catch (err) {
      toast.error(err || 'Failed to create commit');
    }
  };

  if (isLoading) {
    return <div className="p-4 flex justify-center"><LoadingSpinner /></div>;
  }

  const commits = repository?.commits ? [...repository.commits].reverse() : [];

  // Calculate modified files (diff against the latest commit)
  const latestCommit = repository?.commits?.length > 0 ? repository.commits[repository.commits.length - 1] : null;
  const modifiedFiles = [];

  if (latestCommit) {
    files.forEach(file => {
      const currentContent = fileContents[file._id] !== undefined ? fileContents[file._id] : file.content;
      const snapshot = latestCommit.snapshots?.find(s => s.fileId === file._id);

      if (!snapshot) {
        // New file
        modifiedFiles.push({ file, originalContent: '', modifiedContent: currentContent || '', status: 'added' });
      } else if (snapshot.content !== currentContent) {
        // Modified file
        modifiedFiles.push({ file, originalContent: snapshot.content, modifiedContent: currentContent || '', status: 'modified' });
      }
    });
  } else {
    // No commits yet, everything is added
    files.forEach(file => {
      const currentContent = fileContents[file._id] !== undefined ? fileContents[file._id] : file.content;
      modifiedFiles.push({ file, originalContent: '', modifiedContent: currentContent || '', status: 'added' });
    });
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-card)] border-r border-[var(--color-border)] select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">Source Control</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Commit Input Area */}
        <div className="p-3 border-b border-[var(--color-border)] shrink-0">
          <form onSubmit={handleCommit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Commit message"
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={isCommitting || !message.trim()}
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-8"
            >
              {isCommitting ? <LoadingSpinner size="sm" /> : 'Commit'}
            </button>
          </form>
        </div>

        {/* Modified Files */}
        <div className="p-3 border-b border-[var(--color-border)] shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">Modified Files</h3>
          {modifiedFiles.length === 0 ? (
            <div className="text-xs text-[var(--color-text-tertiary)]">No changes.</div>
          ) : (
            <div className="space-y-1">
              {modifiedFiles.map(mod => (
                <div
                  key={mod.file._id}
                  onClick={() => dispatch(setActiveDiff({
                    fileId: mod.file._id,
                    fileName: mod.file.name,
                    language: mod.file.language,
                    originalContent: mod.originalContent,
                    modifiedContent: mod.modifiedContent
                  }))}
                  className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-white/[0.05] cursor-pointer group"
                >
                  <span className="text-[var(--color-text-primary)] truncate">{mod.file.name}</span>
                  <span className={`text-[10px] uppercase font-bold ${mod.status === 'added' ? 'text-green-400' : 'text-amber-400'}`}>
                    {mod.status === 'added' ? 'A' : 'M'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commit History */}
        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">Timeline</h3>

          {commits.length === 0 ? (
            <div className="text-center py-6 text-sm text-[var(--color-text-tertiary)]">
              No commits yet.
            </div>
          ) : (
            <div className="space-y-4">
              {commits.map((commit, index) => (
                <div key={commit._id || index} className="relative pl-4 border-l-2 border-[var(--color-bg-tertiary)] group">
                  <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-[var(--color-bg-card)]"></div>

                  <div className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
                    {commit.message}
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-[var(--color-text-tertiary)] truncate max-w-[120px]">
                      {commit.author?.name || 'User'}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-tertiary)]">
                      <HiOutlineClock />
                      <span>{formatDate(commit.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                      <HiOutlineDocumentText className="h-3.5 w-3.5" />
                      <span>{commit.snapshots?.length || 0} files</span>
                    </div>

                    <button
                      onClick={() => handleRevert(commit._id)}
                      className="opacity-60 hover:opacity-100 flex items-center gap-1 text-[10px] text-rose-400 hover:bg-rose-500/10 px-1.5 py-0.5 rounded transition-all cursor-pointer"
                      title="Revert to this commit"
                    >
                      <HiOutlineReply className="h-3 w-3" /> Revert
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceControl;
