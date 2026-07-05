import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { updateFile, updateFileContentLocal, fetchFileContent } from '../../redux/slices/fileSystemSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { useParams } from 'react-router-dom';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import randomcolor from 'randomcolor';
import useAuth from '../../hooks/useAuth';

const CodeEditor = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const { activeFileId, openFiles, fileContents } = useSelector(state => state.fileSystem);
  const { preferences } = useSelector(state => state.settings);
  
  const saveTimeoutRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const ydocRef = useRef(null);
  const activeFileIdRef = useRef(null);

  const activeFile = openFiles.find(f => f._id === activeFileId);
  const content = fileContents[activeFileId];

  // Keep activeFileIdRef in sync
  activeFileIdRef.current = activeFileId;

  // Fetch content when a new file becomes active and its content is missing
  useEffect(() => {
    if (activeFileId && content === undefined) {
      dispatch(fetchFileContent(activeFileId));
    }
  }, [activeFileId, content, dispatch]);

  const isContentLoaded = content !== undefined;

  // Cleanup Yjs resources
  const cleanupYjs = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    if (bindingRef.current) {
      bindingRef.current.destroy();
      bindingRef.current = null;
    }
    if (providerRef.current) {
      providerRef.current.disconnect();
      providerRef.current = null;
    }
    if (ydocRef.current) {
      ydocRef.current.destroy();
      ydocRef.current = null;
    }
  }, []);

  // Setup Yjs collaboration for the active file
  useEffect(() => {
    if (!editorInstance || !activeFileId || !isContentLoaded || !user) return;

    const editor = editorInstance;
    const model = editor.getModel();
    if (!model) return;

    const currentFileId = activeFileId;
    const currentContent = fileContents[activeFileId];

    // Clean up previous Yjs session (if any)
    cleanupYjs();

    // Set Monaco model content immediately so editor is never blank
    model.setValue(currentContent || '');

    // 1. Create Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const ytext = ydoc.getText('monaco');

    // 2. Connect to Yjs WebSocket server
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/yjs';
    const roomName = `${projectId}-${currentFileId}`;
    
    console.log(`[Yjs] Connecting to: ${wsUrl} for room: ${roomName}`);
    
    const provider = new WebsocketProvider(wsUrl, roomName, ydoc);
    providerRef.current = provider;

    provider.on('status', event => {
      console.log(`[Yjs] Connection status: ${event.status}`);
    });

    // 3. Setup awareness (cursors & names)
    const awareness = provider.awareness;
    awareness.setLocalStateField('user', {
      name: user.name,
      color: randomcolor({ luminosity: 'dark' }),
    });

    // 4. Bind Yjs to Monaco
    const binding = new MonacoBinding(ytext, model, new Set([editor]), awareness);
    bindingRef.current = binding;

    // 5. Seed ytext from DB if the Yjs server room was empty
    let hasSynced = false;
    provider.on('sync', (isSynced) => {
      if (isSynced && !hasSynced) {
        hasSynced = true;
        if (ytext.toString() === '') {
          ytext.insert(0, currentContent || '');
        }
      }
    });

    // 6. Observe Yjs changes → update Redux + debounced DB save
    const observer = () => {
      const value = ytext.toString();
      dispatch(updateFileContentLocal({ id: currentFileId, content: value }));

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        dispatch(updateFile({ id: currentFileId, data: { content: value } }));
      }, 2000);
    };
    ytext.observe(observer);

    // Cleanup
    return () => {
      // Flush pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
        // Do not flush save if we are currently reloading due to a Revert
        if (!window.__isReverting) {
          const finalContent = ytext.toString();
          if (finalContent) {
            dispatch(updateFile({ id: currentFileId, data: { content: finalContent } }));
          }
        }
      }
      ytext.unobserve(observer);
      cleanupYjs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFileId, projectId, user, isContentLoaded, editorInstance]);

  // Monaco onMount — store reference, then trigger Yjs setup
  const handleEditorMount = (editor) => {
    setEditorInstance(editor);
  };

  if (!activeFileId || !activeFile) {
    return null; 
  }

  if (content === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full relative">
      <style>{`
        /* Styles for Yjs remote cursors */
        .yRemoteSelection {
          background-color: rgb(250, 129, 0, 0.5);
          margin-top: 2px;
        }
        .yRemoteSelectionHead {
          position: absolute;
          border-left: 2px solid orange;
          height: 100%;
          box-sizing: border-box;
        }
        .yRemoteSelectionHead::after {
          position: absolute;
          content: attr(data-client-name);
          left: -2px;
          top: -18px;
          background-color: inherit;
          color: white;
          font-family: sans-serif;
          font-size: 10px;
          padding: 2px 4px;
          border-radius: 2px;
          white-space: nowrap;
          pointer-events: none;
        }
      `}</style>
      <Editor
        height="100%"
        theme={preferences?.theme || 'vs-dark'}
        language={activeFile.language || 'plaintext'}
        defaultValue={content || ''}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
          fontSize: preferences?.fontSize || 14,
          tabSize: preferences?.tabSize || 2,
          wordWrap: preferences?.wordWrap ? 'on' : 'off',
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
