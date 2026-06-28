import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { updateWorkspace, clearWorkspaceError } from '../../redux/slices/workspaceSlice';
import { HiOutlineCube } from 'react-icons/hi';
import { cn } from '../../utils/helpers';

const gradientOptions = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-slate-600 to-slate-800'
];

const EditWorkspaceModal = ({ isOpen, onClose, workspace }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.workspace);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (workspace && isOpen) {
      setName(workspace.name || '');
      setDescription(workspace.description || '');
      setColor(workspace.color || gradientOptions[0]);
    }
  }, [workspace, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearWorkspaceError());
    
    if (name === workspace.name && description === workspace.description && color === workspace.color) {
      onClose(); // No changes made
      return;
    }

    const resultAction = await dispatch(updateWorkspace({ 
      id: workspace._id, 
      workspaceData: { name, description, color } 
    }));
    
    if (updateWorkspace.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  const handleClose = () => {
    dispatch(clearWorkspaceError());
    onClose();
  };

  if (!workspace) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Workspace" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error" message={error} onClose={() => dispatch(clearWorkspaceError())} />}
        
        <Input
          label="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={50}
        />
        
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Description <span className="text-[var(--color-text-tertiary)]">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            rows={3}
            className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-[var(--color-text-primary)] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm resize-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
            Theme Color
          </label>
          <div className="flex flex-wrap gap-3">
            {gradientOptions.map(grad => (
              <button
                key={grad}
                type="button"
                onClick={() => setColor(grad)}
                className={cn(
                  "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white cursor-pointer transition-all",
                  grad,
                  color === grad ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--color-bg-card)] scale-110" : "opacity-70 hover:opacity-100"
                )}
              >
                {color === grad && <HiOutlineCube className="h-5 w-5 drop-shadow-md" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)] mt-6">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={!name.trim()}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditWorkspaceModal;
