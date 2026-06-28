import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCommit } from '../../redux/slices/gitSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { HiOutlineClock, HiOutlineDocumentText } from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const SourceControl = ({ projectId }) => {
  const dispatch = useDispatch();
  const { repository, isLoading, isCommitting } = useSelector(state => state.git);
  const [message, setMessage] = useState('');

  const handleCommit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await dispatch(createCommit({ projectId, message })).unwrap();
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
                <div key={commit._id || index} className="relative pl-4 border-l-2 border-[var(--color-bg-tertiary)]">
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
                  
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-[var(--color-text-secondary)]">
                    <HiOutlineDocumentText className="h-3.5 w-3.5" />
                    <span>{commit.snapshots?.length || 0} files</span>
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
