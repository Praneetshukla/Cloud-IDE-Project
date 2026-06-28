import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { HiOutlineTerminal, HiX, HiOutlineTrash } from 'react-icons/hi';
import { closeTerminal, clearLogs } from '../../redux/slices/terminalSlice';
import '@xterm/xterm/css/xterm.css';

const TerminalPanel = () => {
  const dispatch = useDispatch();
  const { isOpen, logs, isExecuting } = useSelector(state => state.terminal);
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  
  // Track how many logs we've written so we don't re-write everything
  const writtenLogsCount = useRef(0);

  useEffect(() => {
    if (isOpen && terminalRef.current && !xtermRef.current) {
      // Initialize xterm.js
      const term = new Terminal({
        theme: {
          background: '#0f111a',
          foreground: '#e2e8f0',
          cursor: '#818cf8',
          black: '#000000',
          red: '#f87171',
          green: '#4ade80',
          yellow: '#facc15',
          blue: '#60a5fa',
          magenta: '#c084fc',
          cyan: '#22d3ee',
          white: '#ffffff',
          brightBlack: '#64748b',
        },
        fontFamily: "'Fira Code', 'Consolas', monospace",
        fontSize: 13,
        cursorBlink: true,
        disableStdin: true, // Output only for this Lite version
        convertEol: true
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();
      
      term.writeln('\x1b[36mOrbit Lite Execution Terminal\x1b[0m');
      term.writeln('Ready to execute code...\r\n');

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;
      writtenLogsCount.current = 0;

      const handleResize = () => {
        fitAddon.fit();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.dispose();
        xtermRef.current = null;
      };
    }
  }, [isOpen]);

  // When logs change, write new logs to terminal
  useEffect(() => {
    if (xtermRef.current && isOpen) {
      // If logs were cleared
      if (logs.length === 0 && writtenLogsCount.current > 0) {
        xtermRef.current.clear();
        xtermRef.current.writeln('\x1b[36mTerminal Cleared\x1b[0m');
        writtenLogsCount.current = 0;
      }

      // Write any new logs
      for (let i = writtenLogsCount.current; i < logs.length; i++) {
        const log = logs[i];
        if (log.type === 'error') {
          xtermRef.current.write(`\x1b[31m${log.text}\x1b[0m\r\n`);
        } else if (log.type === 'info') {
          xtermRef.current.write(`\x1b[34m${log.text}\x1b[0m\r\n`);
        } else {
          xtermRef.current.write(`${log.text}\r\n`);
        }
      }
      writtenLogsCount.current = logs.length;
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="h-64 border-t border-[var(--color-border)] bg-[#0f111a] flex flex-col shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] relative">
      {/* Terminal Header */}
      <div className="h-9 flex items-center justify-between px-4 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          <HiOutlineTerminal className="h-4 w-4" />
          <span>Terminal</span>
          {isExecuting && (
             <span className="text-amber-400 normal-case tracking-normal ml-2 animate-pulse">Running...</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => dispatch(clearLogs())}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[var(--color-bg-tertiary)] transition-colors"
            title="Clear Terminal"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
          <button 
            onClick={() => dispatch(closeTerminal())}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[var(--color-bg-tertiary)] transition-colors"
            title="Close Terminal"
          >
            <HiX className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="flex-1 overflow-hidden p-2 relative">
        <div ref={terminalRef} className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default TerminalPanel;
