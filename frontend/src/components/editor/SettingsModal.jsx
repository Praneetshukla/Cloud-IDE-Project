import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiX, HiOutlineCog } from 'react-icons/hi';
import { closeSettingsModal, updateSettings } from '../../redux/slices/settingsSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const SettingsModal = () => {
  const dispatch = useDispatch();
  const { isSettingsModalOpen, preferences, isSaving } = useSelector(state => state.settings);
  
  const [formData, setFormData] = useState(preferences);

  useEffect(() => {
    setFormData(preferences);
  }, [preferences]);

  if (!isSettingsModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'fontSize' || name === 'tabSize' ? Number(value) : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateSettings(formData)).unwrap();
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err || 'Failed to save settings');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold text-lg">
            <HiOutlineCog className="h-6 w-6 text-indigo-400" />
            <h2>Editor Settings</h2>
          </div>
          <button 
            onClick={() => dispatch(closeSettingsModal())}
            className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* Theme */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Editor Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="vs-dark">Dark (Orbit Default)</option>
              <option value="light">Light</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Font Size</label>
            <input
              type="number"
              name="fontSize"
              value={formData.fontSize}
              onChange={handleChange}
              min="8" max="32"
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tab Size */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Tab Size</label>
            <select
              name="tabSize"
              value={formData.tabSize}
              onChange={handleChange}
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={8}>8 Spaces</option>
            </select>
          </div>

          {/* Word Wrap */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Word Wrap</label>
            <select
              name="wordWrap"
              value={formData.wordWrap}
              onChange={handleChange}
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dispatch(closeSettingsModal())}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-w-[80px]"
            >
              {isSaving ? <LoadingSpinner size="sm" /> : 'Save'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SettingsModal;
