import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { createProject, clearProjectError } from '../../redux/slices/projectSlice';

const CreateFromTemplateModal = ({ isOpen, onClose, template }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.project);
  const { workspaces } = useSelector(state => state.workspace);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');

  // Auto-select first workspace if available
  useEffect(() => {
    if (workspaces.length > 0 && !workspaceId) {
      setWorkspaceId(workspaces[0]._id);
    }
  }, [workspaces, workspaceId]);

  // Set default name based on template when modal opens
  useEffect(() => {
    if (isOpen && template) {
      setName(`my-${template.value}-app`);
    }
  }, [isOpen, template]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearProjectError());

    if (!workspaceId) {
      alert('Please select a workspace');
      return;
    }

    const resultAction = await dispatch(createProject({
      name,
      description,
      workspace: workspaceId,
      language: template.value, // e.g., 'react', 'node'
    }));

    if (createProject.fulfilled.match(resultAction)) {
      const newProject = resultAction.payload;
      handleClose();
      // Navigate to the editor for the new project
      navigate(`/editor/${newProject._id}`);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    dispatch(clearProjectError());
    onClose();
  };

  if (!template) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Create ${template.label} Project`} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error" message={error} onClose={() => dispatch(clearProjectError())} />}

        <div className="flex items-center gap-3 p-4 rounded-lg bg-surface/30 border border-white/5 mb-2">
          <div className="text-3xl">{template.icon}</div>
          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)]">{template.label} Template</h4>
            <p className="text-xs text-[var(--color-text-tertiary)]">A complete boilerplate to get you started quickly.</p>
          </div>
        </div>

        <Input
          label="Project Name"
          placeholder="e.g., my-awesome-app"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
        />

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Workspace
          </label>
          {workspaces.length === 0 ? (
            <div className="text-sm text-amber-400 p-2 bg-amber-400/10 rounded border border-amber-400/20">
              You don't have any workspaces yet. Please create one from the Dashboard first.
            </div>
          ) : (
            <select
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              required
              className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2.5 text-[var(--color-text-primary)] focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm cursor-pointer"
            >
              {workspaces.map(ws => (
                <option key={ws._id} value={ws._id}>
                  {ws.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Description <span className="text-[var(--color-text-tertiary)]">(optional)</span>
          </label>
          <textarea
            placeholder="Brief description of this project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={2}
            className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm resize-none transition-colors"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)] mt-6">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isLoading} 
            disabled={!name.trim() || !workspaceId}
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 border-0"
          >
            Create & Scaffold
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFromTemplateModal;
