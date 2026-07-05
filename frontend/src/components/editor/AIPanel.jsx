import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../redux/slices/aiSlice';
import { HiOutlineSparkles, HiOutlineUser } from 'react-icons/hi';
import LoadingSpinner from '../common/LoadingSpinner';

const AIPanel = ({ projectId }) => {
  const dispatch = useDispatch();
  const { chat, isLoading, isTyping } = useSelector(state => state.ai);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const message = input;
    setInput(''); // clear immediately for better UX
    await dispatch(sendMessage({ projectId, message }));
  };

  if (isLoading) {
    return <div className="p-4 flex justify-center"><LoadingSpinner /></div>;
  }

  const messages = chat?.messages || [];

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-card)] border-r border-[var(--color-border)] select-text">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] shrink-0 select-none">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <HiOutlineSparkles className="h-4 w-4" /> Orbit AI
        </h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-indigo-600 text-white'
              }`}>
              {msg.role === 'user' ? <HiOutlineUser className="h-4 w-4" /> : <HiOutlineSparkles className="h-4 w-4" />}
            </div>

            <div className={`text-sm px-3 py-2 rounded-xl max-w-[85%] break-words ${msg.role === 'user'
                ? 'bg-slate-700 text-white rounded-tr-sm'
                : 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30 rounded-tl-sm'
              }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 flex-row">
            <div className="shrink-0 h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <HiOutlineSparkles className="h-4 w-4" />
            </div>
            <div className="text-sm px-4 py-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 rounded-tl-sm text-indigo-300 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-[var(--color-border)] shrink-0 bg-[var(--color-bg-secondary)]">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask Orbit AI..."
            className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-md pl-3 pr-10 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 resize-none no-scrollbar"
            rows={2}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="absolute right-2 bottom-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineSparkles className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIPanel;
