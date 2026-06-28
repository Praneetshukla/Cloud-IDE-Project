import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { updateFile, updateFileContentLocal, fetchFileContent } from '../../redux/slices/fileSystemSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const CodeEditor = () => {
  const dispatch = useDispatch();
  const { activeFileId, openFiles, fileContents } = useSelector(state => state.fileSystem);
  const { preferences } = useSelector(state => state.settings);
  const saveTimeoutRef = useRef(null);

  const activeFile = openFiles.find(f => f._id === activeFileId);
  const content = fileContents[activeFileId];

  // Fetch content when a new file becomes active and its content is missing
  useEffect(() => {
    if (activeFileId && content === undefined) {
      dispatch(fetchFileContent(activeFileId));
    }
  }, [activeFileId, content, dispatch]);

  // Debounced Save
  const handleEditorChange = (value) => {
    if (!activeFileId) return;

    // 1. Immediately update local Redux state for fast UI feedback
    dispatch(updateFileContentLocal({ id: activeFileId, content: value }));

    // 2. Debounce the API call to save to the database
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      dispatch(updateFile({ id: activeFileId, data: { content: value } }));
    }, 1000); // 1-second debounce
  };

  if (!activeFileId || !activeFile) {
    return null; // Should be handled by EditorPage, but just in case
  }

  if (content === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-primary)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full relative">
      <Editor
        height="100%"
        theme={preferences.theme || 'vs-dark'}
        language={activeFile.language || 'plaintext'}
        value={content}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: preferences.fontSize || 14,
          tabSize: preferences.tabSize || 2,
          wordWrap: preferences.wordWrap ? 'on' : 'off',
          fontFamily: "'Fira Code', 'Consolas', monospace",
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          padding: { top: 16 },
        }}
        loading={<LoadingSpinner />}
      />
    </div>
  );
};

export default CodeEditor;
