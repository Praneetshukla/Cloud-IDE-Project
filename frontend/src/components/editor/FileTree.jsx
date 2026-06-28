import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiOutlineDocumentAdd, HiOutlineFolderAdd, HiOutlineRefresh } from 'react-icons/hi';
import { createFolder, createFile, fetchProjectTree } from '../../redux/slices/fileSystemSlice';
import FileTreeNode from './FileTreeNode';
import FileIcon from './FileIcon';

const FileTree = ({ projectId, folders, files, onFileClick }) => {
  const dispatch = useDispatch();
  
  // State for creating at root level
  const [creatingType, setCreatingType] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  // Root level items have parent = null for folders, and folder = null for files
  const rootFolders = folders.filter(f => !f.parent);
  const rootFiles = files.filter(f => !f.folder);

  const handleCreateRoot = (type) => {
    setCreatingType(type);
    setNewItemName('');
  };

  const submitCreateRoot = async () => {
    if (!newItemName.trim()) {
      setCreatingType(null);
      return;
    }
    
    if (creatingType === 'folder') {
      await dispatch(createFolder({ name: newItemName, project: projectId, parent: null }));
    } else {
      await dispatch(createFile({ name: newItemName, project: projectId, folder: null }));
    }
    setCreatingType(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitCreateRoot();
    if (e.key === 'Escape') setCreatingType(null);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-card)] border-r border-[var(--color-border)] select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">Explorer</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => handleCreateRoot('file')} className="p-1 rounded text-slate-400 hover:text-white hover:bg-[var(--color-bg-tertiary)] transition-colors" title="New File">
            <HiOutlineDocumentAdd className="h-4 w-4" />
          </button>
          <button onClick={() => handleCreateRoot('folder')} className="p-1 rounded text-slate-400 hover:text-white hover:bg-[var(--color-bg-tertiary)] transition-colors" title="New Folder">
            <HiOutlineFolderAdd className="h-4 w-4" />
          </button>
          <button onClick={() => dispatch(fetchProjectTree(projectId))} className="p-1 rounded text-slate-400 hover:text-white hover:bg-[var(--color-bg-tertiary)] transition-colors" title="Refresh Explorer">
            <HiOutlineRefresh className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
        {creatingType && (
          <div className="flex items-center gap-1.5 py-1 px-3 text-sm">
            <FileIcon type={creatingType} name={newItemName || 'new'} isOpen={false} />
            <input
              autoFocus
              placeholder={`New ${creatingType}...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={submitCreateRoot}
              onKeyDown={handleKeyDown}
              className="bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded px-1 w-full text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {rootFolders.map(folder => (
          <FileTreeNode 
            key={folder._id} 
            item={folder} 
            type="folder" 
            projectId={projectId}
            folders={folders} 
            files={files} 
            onFileClick={onFileClick}
          />
        ))}
        {rootFiles.map(file => (
          <FileTreeNode 
            key={file._id} 
            item={file} 
            type="file" 
            projectId={projectId}
            folders={folders} 
            files={files} 
            onFileClick={onFileClick}
          />
        ))}

        {rootFolders.length === 0 && rootFiles.length === 0 && !creatingType && (
          <div className="text-center px-4 py-8 text-sm text-[var(--color-text-tertiary)]">
            <p>No files found.</p>
            <p className="mt-1">Create a file to start coding.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTree;
