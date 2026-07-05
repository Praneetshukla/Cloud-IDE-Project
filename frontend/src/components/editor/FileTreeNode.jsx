import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiOutlineDocumentAdd, HiOutlineFolderAdd, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { createFolder, createFile, updateFolder, updateFile, deleteFolder, deleteFile } from '../../redux/slices/fileSystemSlice';
import FileIcon from './FileIcon';
import { cn } from '../../utils/helpers';

const FileTreeNode = ({ 
  item, 
  type, // 'folder' | 'file'
  level = 0, 
  projectId, 
  folders, 
  files, 
  onFileClick,
  activeUsers = []
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  
  // State for creating new items inline
  const [creatingType, setCreatingType] = useState(null); // 'folder' | 'file' | null
  const [newItemName, setNewItemName] = useState('');

  const paddingLeft = `${level * 12 + 12}px`;

  const childFolders = type === 'folder' ? folders.filter(f => f.parent === item._id) : [];
  const childFiles = type === 'folder' ? files.filter(f => f.folder === item._id) : [];

  const handleToggle = () => {
    if (type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      if (onFileClick) onFileClick(item);
    }
  };

  const handleCreateNew = (newType, e) => {
    e.stopPropagation();
    setIsOpen(true);
    setCreatingType(newType);
    setNewItemName('');
  };

  const submitCreateNew = async () => {
    if (!newItemName.trim()) {
      setCreatingType(null);
      return;
    }
    
    if (creatingType === 'folder') {
      await dispatch(createFolder({ name: newItemName, project: projectId, parent: item._id }));
    } else {
      await dispatch(createFile({ name: newItemName, project: projectId, folder: item._id }));
    }
    setCreatingType(null);
  };

  const submitEdit = async () => {
    if (!editName.trim() || editName === item.name) {
      setIsEditing(false);
      return;
    }

    if (type === 'folder') {
      await dispatch(updateFolder({ id: item._id, data: { name: editName } }));
    } else {
      await dispatch(updateFile({ id: item._id, data: { name: editName } }));
    }
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${type} "${item.name}"?`)) {
      if (type === 'folder') {
        dispatch(deleteFolder(item._id));
      } else {
        dispatch(deleteFile(item._id));
      }
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setCreatingType(null);
      setEditName(item.name);
    }
  };

  return (
    <div>
      <div 
        className={cn(
          "group flex items-center justify-between py-1 text-sm cursor-pointer hover:bg-[var(--color-bg-tertiary)] transition-colors",
          type === 'file' ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-primary)]"
        )}
        style={{ paddingLeft, paddingRight: '8px' }}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          <FileIcon type={type} name={item.name} isOpen={isOpen} />
          
          {isEditing ? (
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={submitEdit}
              onKeyDown={(e) => handleKeyDown(e, submitEdit)}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded px-1 w-full text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <span className="truncate select-none">{item.name}</span>
          )}
        </div>

        {/* Presence Indicators & Actions */}
        <div className="flex items-center gap-2">
          {/* Active Users Viewing this File */}
          {type === 'file' && (
            <div className="flex items-center -space-x-1.5 mr-1">
              {activeUsers.filter(u => u.activeFileId === item._id).map((u) => (
                <div 
                  key={u.socketId}
                  className="w-4 h-4 rounded-full border border-[var(--color-bg-card)] flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: u.color }}
                  title={`${u.name} is viewing this file`}
                >
                  {u.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}

          {/* Hover Actions */}
          <div className="hidden group-hover:flex items-center gap-1">
          {type === 'folder' && (
            <>
              <button onClick={(e) => handleCreateNew('file', e)} className="p-0.5 text-slate-400 hover:text-white" title="New File">
                <HiOutlineDocumentAdd className="h-3.5 w-3.5" />
              </button>
              <button onClick={(e) => handleCreateNew('folder', e)} className="p-0.5 text-slate-400 hover:text-white" title="New Folder">
                <HiOutlineFolderAdd className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-0.5 text-slate-400 hover:text-white" title="Rename">
            <HiOutlinePencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleDelete} className="p-0.5 text-slate-400 hover:text-red-400" title="Delete">
            <HiOutlineTrash className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    {/* Inline Create Input */}
      {creatingType && (
        <div className="flex items-center gap-1.5 py-1 text-sm" style={{ paddingLeft: `${(level + 1) * 12 + 12}px`, paddingRight: '8px' }}>
          <FileIcon type={creatingType} name={newItemName || 'new'} isOpen={false} />
          <input
            autoFocus
            placeholder={`New ${creatingType}...`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onBlur={submitCreateNew}
            onKeyDown={(e) => handleKeyDown(e, submitCreateNew)}
            className="bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded px-1 w-full text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* Children rendering */}
      {type === 'folder' && isOpen && (
        <div>
          {/* Render Folders First */}
          {childFolders.map(folder => (
            <FileTreeNode 
              key={folder._id} 
              item={folder} 
              type="folder" 
              level={level + 1} 
              projectId={projectId}
              folders={folders} 
              files={files} 
              onFileClick={onFileClick}
              activeUsers={activeUsers}
            />
          ))}
          {/* Then Render Files */}
          {childFiles.map(file => (
            <FileTreeNode 
              key={file._id} 
              item={file} 
              type="file" 
              level={level + 1} 
              projectId={projectId}
              folders={folders} 
              files={files} 
              onFileClick={onFileClick}
              activeUsers={activeUsers}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTreeNode;
