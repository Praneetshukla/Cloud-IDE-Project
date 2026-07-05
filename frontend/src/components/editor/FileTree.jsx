import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiOutlineDocumentAdd, HiOutlineFolderAdd, HiOutlineRefresh } from 'react-icons/hi';
import { createFolder, createFile, fetchProjectTree, uploadFiles } from '../../redux/slices/fileSystemSlice';
import FileTreeNode from './FileTreeNode';
import FileIcon from './FileIcon';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const FileTree = ({ projectId, folders, files, onFileClick, activeUsers = [] }) => {
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

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only reset if leaving the main container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const readEntryContent = async (entry, path = '') => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve([{
              name: file.name,
              path: path,
              content: e.target.result
            }]);
          };
          reader.readAsText(file);
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const entries = [];
        const readEntries = () => {
          dirReader.readEntries(async (results) => {
            if (!results.length) {
              let allFiles = [];
              for (const child of entries) {
                const childFiles = await readEntryContent(child, `${path}/${entry.name}`);
                allFiles = [...allFiles, ...childFiles];
              }
              resolve(allFiles);
            } else {
              entries.push(...results);
              readEntries();
            }
          });
        };
        readEntries();
      }
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (!e.dataTransfer.items || e.dataTransfer.items.length === 0) return;

    setIsUploading(true);
    try {
      let allFiles = [];
      const items = e.dataTransfer.items;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            const files = await readEntryContent(entry, '');
            allFiles = [...allFiles, ...files];
          }
        }
      }

      if (allFiles.length > 0) {
        await dispatch(uploadFiles({ project: projectId, files: allFiles })).unwrap();
        toast.success(`Successfully uploaded ${allFiles.length} file(s)`);
      }
    } catch (err) {
      toast.error(err || 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-[var(--color-bg-card)] border-r border-[var(--color-border)] select-none relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-500/20 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 rounded-md m-2 pointer-events-none">
          <div className="bg-indigo-600 rounded-full p-4 mb-3 shadow-lg shadow-indigo-500/30">
            <HiOutlineDocumentAdd className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">Drop to Upload</h3>
          <p className="text-indigo-200 text-sm text-center mt-1 px-4">Files and folders will be added to this project</p>
        </div>
      )}

      {/* Uploading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 z-50 bg-[var(--color-bg-primary)]/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
          <LoadingSpinner size="lg" />
          <p className="text-sm font-medium mt-3 text-[var(--color-text-primary)] animate-pulse">Uploading files...</p>
        </div>
      )}

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
            activeUsers={activeUsers}
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
            activeUsers={activeUsers}
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
