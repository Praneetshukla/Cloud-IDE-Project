import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkspaceById, clearCurrentWorkspace } from '../../redux/slices/workspaceSlice';
import { HiOutlineCube, HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProjectCard from '../../components/common/ProjectCard';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import { cn } from '../../utils/helpers';

const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const { currentWorkspace, isLoading, error } = useSelector((state) => state.workspace);
  // We'll need a way to filter projects by workspace. 
  // For now we can pull from the projects slice, assuming we fetched them, or we could add a specific API call.
  // In Phase 2, `fetchProjects` gets all projects, so we can filter locally.
  const { projects, isLoading: projLoading } = useSelector((state) => state.project);
  
  const workspaceProjects = projects.filter(p => p.workspace?._id === id || p.workspace === id);

  useEffect(() => {
    dispatch(fetchWorkspaceById(id));
    return () => {
      dispatch(clearCurrentWorkspace());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  if (error || !currentWorkspace) {
    return (
      <div className="px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Workspace not found</h2>
        <p className="text-[var(--color-text-secondary)] mt-2">{error || "The workspace you're looking for doesn't exist."}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-6 text-indigo-500 hover:text-indigo-400 font-medium cursor-pointer"
        >
          &larr; Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] mb-6 transition-colors cursor-pointer"
        >
          <HiOutlineArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg",
              currentWorkspace.color || "bg-gradient-to-br from-indigo-500 to-purple-600"
            )}>
              <HiOutlineCube className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{currentWorkspace.name}</h1>
              <p className="text-[var(--color-text-secondary)] mt-1 max-w-2xl">
                {currentWorkspace.description || 'No description provided.'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:brightness-110 text-white font-medium text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            <HiOutlinePlus className="h-4 w-4" /> New Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">Projects in this Workspace</h2>
        
        {projLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : workspaceProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {workspaceProjects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] border-dashed p-12 text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">No projects yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-5 max-w-md mx-auto">This workspace is empty. Create a project to get started.</p>
            <button 
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] font-medium text-sm transition-colors cursor-pointer"
            >
              <HiOutlinePlus className="h-4 w-4" /> Create Project
            </button>
          </div>
        )}
      </div>

      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen} 
        onClose={() => setIsCreateProjectModalOpen(false)} 
        workspaceId={id} 
      />
    </div>
  );
};

export default WorkspacePage;
