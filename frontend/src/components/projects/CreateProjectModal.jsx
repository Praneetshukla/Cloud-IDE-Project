import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { createProject, clearProjectError } from '../../redux/slices/projectSlice';
import { HiOutlineCode } from 'react-icons/hi';
import { cn } from '../../utils/helpers';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'node', label: 'Node.js', icon: '🟢' },
  { value: 'html', label: 'HTML/CSS', icon: '🌐' },
  { value: 'other', label: 'Other', icon: '📄' },
];

const CreateProjectModal = ({ isOpen, onClose, workspaceId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.project);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearProjectError());

    const resultAction = await dispatch(createProject({
      name,
      description,
      workspace: workspaceId,
      language,
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
    setLanguage('javascript');
    dispatch(clearProjectError());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Project" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error" message={error} onClose={() => dispatch(clearProjectError())} />}

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
            Description <span className="text-[var(--color-text-tertiary)]">(optional)</span>
          </label>
          <textarea
            placeholder="Brief description of this project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm resize-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
            Language / Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {languageOptions.map(lang => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setLanguage(lang.value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer text-left",
                  language === lang.value
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30"
                    : "border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <span className="text-base">{lang.icon}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)] mt-6">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={!name.trim()}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
