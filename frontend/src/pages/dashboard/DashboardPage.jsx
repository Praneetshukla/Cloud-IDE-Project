import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineCode, HiOutlineTerminal, HiOutlineLightningBolt } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import { fetchWorkspaces } from '../../redux/slices/workspaceSlice';
import { fetchRecentProjects, fetchProjects } from '../../redux/slices/projectSlice';
import WorkspaceCard from '../../components/common/WorkspaceCard';
import ProjectCard from '../../components/common/ProjectCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CreateWorkspaceModal from '../../components/workspaces/CreateWorkspaceModal';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const { workspaces, isLoading: wsLoading } = useSelector((state) => state.workspace);
  const { recentProjects, projects, isLoading: projLoading } = useSelector((state) => state.project);
  
  const [filter, setFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
    dispatch(fetchRecentProjects());
    if (searchQuery || filter !== 'all') {
      dispatch(fetchProjects({ search: searchQuery, language: filter }));
    }
  }, [dispatch, searchQuery, filter]);

  const quickActions = [
    { icon: HiOutlinePlus, title: 'New Workspace', description: 'Create a blank workspace', color: 'from-indigo-500 to-purple-600', onClick: () => setIsCreateModalOpen(true) },
    { icon: HiOutlineCode, title: 'Import Repository', description: 'Clone from Git', color: 'from-cyan-500 to-blue-600', onClick: () => toast('Import Repository coming soon!', { icon: '🚧' }) },
    { icon: HiOutlineTerminal, title: 'Open Terminal', description: 'Quick shell access', color: 'from-emerald-500 to-teal-600', onClick: () => toast('Terminal coming soon!', { icon: '🚧' }) },
    { icon: HiOutlineLightningBolt, title: 'Templates', description: 'Start from a template', color: 'from-amber-500 to-orange-600', onClick: () => toast('Templates coming soon!', { icon: '🚧' }) },
  ];

  const displayedProjects = (searchQuery || filter !== 'all') ? projects : recentProjects;

  return (
    <div className="px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Welcome */}
      {!searchQuery && (
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Welcome back, {user?.name?.split(' ')[0] || 'Developer'}!
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1.5">
            Your cloud development environment is ready. Let&apos;s build something amazing.
          </p>
        </div>
      )}

      {/* Quick Actions (only hide on search) */}
      {!searchQuery && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button 
                key={action.title} 
                onClick={action.onClick}
                className="group relative flex flex-col items-start p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer text-left"
              >
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{action.title}</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent Projects'}
          </h2>
          
          <div className="flex gap-2 p-1 bg-[var(--color-bg-tertiary)] rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
            {['all', 'javascript', 'react', 'node', 'python'].map(lang => (
              <button
                key={lang}
                onClick={() => setFilter(lang)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filter === lang 
                    ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {projLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedProjects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
           <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] border-dashed p-12 text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">No projects found</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Workspaces Section (hide on search) */}
      {!searchQuery && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Workspaces</h2>
          </div>
          
          {wsLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {workspaces.map(workspace => (
                <WorkspaceCard key={workspace._id} workspace={workspace} />
              ))}
            </div>
          ) : (
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] border-dashed p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                <HiOutlineCode className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">No workspaces yet</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-5 max-w-md mx-auto">Create your first workspace to start coding in the cloud.</p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer transition-all duration-300"
              >
                <HiOutlinePlus className="h-4 w-4" /> Create Workspace
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateWorkspaceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;
