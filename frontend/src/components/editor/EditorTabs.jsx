import { useDispatch, useSelector } from 'react-redux';
import { HiX } from 'react-icons/hi';
import { setActiveFile, closeFile } from '../../redux/slices/fileSystemSlice';
import FileIcon from './FileIcon';
import { cn } from '../../utils/helpers';

const EditorTabs = () => {
  const dispatch = useDispatch();
  const { openFiles, activeFileId } = useSelector(state => state.fileSystem);

  if (openFiles.length === 0) return null;

  return (
    <div className="flex items-center overflow-x-auto no-scrollbar bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] shrink-0">
      {openFiles.map(file => {
        const isActive = file._id === activeFileId;
        
        return (
          <div
            key={file._id}
            onClick={() => dispatch(setActiveFile(file._id))}
            className={cn(
              "group flex items-center gap-2 px-4 py-2 min-w-[120px] max-w-[200px] cursor-pointer border-r border-[var(--color-border)] transition-colors relative",
              isActive 
                ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" 
                : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
            )}
          >
            {/* Active Top Border Indicator */}
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500" />
            )}

            <FileIcon type="file" name={file.name} />
            
            <span className="text-xs truncate flex-1 select-none font-medium">
              {file.name}
            </span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(closeFile(file._id));
              }}
              className={cn(
                "p-0.5 rounded-md hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100",
                isActive ? "opacity-100" : ""
              )}
            >
              <HiX className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorTabs;
