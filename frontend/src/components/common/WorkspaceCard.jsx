import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineDotsVertical, HiOutlineUsers, HiOutlineCube, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { formatDate, cn } from '../../utils/helpers';
import { deleteWorkspace } from '../../redux/slices/workspaceSlice';
import EditWorkspaceModal from '../workspaces/EditWorkspaceModal';

const WorkspaceCard = ({ workspace }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete workspace "${workspace.name}"? This action cannot be undone and will delete all projects inside it.`)) {
      dispatch(deleteWorkspace(workspace._id));
    }
  };

  const navigateToWorkspace = (e) => {
    // Prevent navigation if clicking on the menu button
    if (menuRef.current && menuRef.current.contains(e.target)) return;
    navigate(`/workspaces/${workspace._id}`);
  };

  return (
    <>
      <div 
        className="group relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5 hover:shadow-lg hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
        onClick={navigateToWorkspace}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
            workspace.color || "from-indigo-500 to-purple-600"
          )}>
             <HiOutlineCube className="h-6 w-6" />
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] p-1 rounded-md hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
            >
              <HiOutlineDotsVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-xl z-10 animate-scale-in origin-top-right py-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setIsEditModalOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                >
                  <HiOutlinePencil className="h-4 w-4" /> Edit Workspace
                </button>
                <div className="border-t border-[var(--color-border)] my-1"></div>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); handleDelete(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <HiOutlineTrash className="h-4 w-4" /> Delete Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="block">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-indigo-400 transition-colors truncate">
            {workspace.name}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2 min-h-[40px]">
            {workspace.description || 'No description provided.'}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
          <div className="flex items-center gap-1.5">
            <HiOutlineUsers className="h-4 w-4" />
            <span>{workspace.members?.length || 1} members</span>
          </div>
          <span>Updated {formatDate(workspace.updatedAt)}</span>
        </div>
      </div>

      <EditWorkspaceModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        workspace={workspace} 
      />
    </>
  );
};

export default WorkspaceCard;
