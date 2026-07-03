import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  const quickActions = [
    { icon: HiOutlinePlus, title: 'New Workspace', description: 'Create a blank workspace', color: 'from-cyan-400 to-cyan-600', onClick: () => setIsCreateModalOpen(true) },
    { icon: HiOutlineCode, title: 'Your Projects', description: 'View all projects', color: 'from-teal-400 to-emerald-600', onClick: () => setFilter('all') },
    { icon: HiOutlineTerminal, title: 'Resume Editor', description: 'Open your last project', color: 'from-fuchsia-400 to-purple-600', onClick: () => {
      if (recentProjects.length > 0) {
        navigate(`/editor/${recentProjects[0]._id}`);
      } else {
        toast('No recent projects found', { icon: 'ℹ️' });
      }
    } },
    { icon: HiOutlineLightningBolt, title: 'Settings', description: 'Manage preferences', color: 'from-amber-400 to-orange-600', onClick: () => navigate('/profile') },
  ];

  const displayedProjects = (searchQuery || filter !== 'all') ? projects : recentProjects;

  return (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto relative z-10 animate-fade-in-up">
      {/* Welcome */}
      {!searchQuery && (
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold gradient-text pb-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Developer'}!
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1.5">
            Your cloud development environment is ready. Let&apos;s build something amazing.
          </p>
        </div>
      )}

      {/* Grid of Main Content & Side Container Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Main Actions & Lists) - Columns 1-8 */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Quick Actions (only hide on search) */}
          {!searchQuery && (
            <div className="animate-fade-in-up animation-delay-100">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <button 
                    key={action.title} 
                    onClick={action.onClick}
                    className={`group relative flex flex-col items-start p-5 rounded-xl border border-white/5 bg-surface/30 backdrop-blur-md hover-lift hover-glow transition-all duration-300 cursor-pointer text-left overflow-hidden animate-fade-in-up animation-delay-${(idx + 1) * 100}`}
                  >
                    {/* Top laser line on hover */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          <div id="projects" className="animate-fade-in-up animation-delay-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent Projects'}
              </h2>
              
              <div className="flex gap-2 p-1 bg-surface/30 border border-white/5 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
                {['all', 'javascript', 'react', 'node', 'python'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setFilter(lang)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      filter === lang 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' 
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayedProjects.map(project => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-surface/10 rounded-xl border border-white/5 border-dashed p-12 text-center">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">No projects found</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>

          {/* Workspaces Section (hide on search) */}
          {!searchQuery && (
            <div id="workspaces" className="animate-fade-in-up animation-delay-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Workspaces</h2>
              </div>
              
              {wsLoading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
              ) : workspaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workspaces.map(workspace => (
                    <WorkspaceCard key={workspace._id} workspace={workspace} />
                  ))}
                </div>
              ) : (
                <div className="bg-surface/10 rounded-xl border border-white/5 border-dashed p-12 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 flex items-center justify-center mb-4">
                    <HiOutlineCode className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">No workspaces yet</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-5 max-w-md mx-auto">Create your first workspace to start coding in the cloud.</p>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer transition-all duration-300 animate-pulse"
                  >
                    <HiOutlinePlus className="h-4 w-4" /> Create Workspace
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column (Compute Health Monitor) - Columns 9-12 */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Cloud IDE Container Monitor */}
          <div className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-hologram animate-fade-in-up animation-delay-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">Compute Node</h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* CPU Circle Gauge */}
              <div className="flex flex-col items-center p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                    <circle cx="40" cy="40" r="32" stroke="#0891b2" strokeWidth="6" fill="transparent" 
                      strokeDasharray="201" strokeDashoffset="132" strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-cyan-400 animate-pulse">34%</span>
                    <span className="text-[9px] text-[var(--color-text-tertiary)] uppercase font-semibold">CPU</span>
                  </div>
                </div>
              </div>

              {/* RAM Circle Gauge */}
              <div className="flex flex-col items-center p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                    <circle cx="40" cy="40" r="32" stroke="#d946ef" strokeWidth="6" fill="transparent" 
                      strokeDasharray="201" strokeDashoffset="170" strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-fuchsia-400 animate-pulse">15%</span>
                    <span className="text-[9px] text-[var(--color-text-tertiary)] uppercase font-semibold">RAM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Linear Metrics */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                  <span>Disk Storage</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">4.8 GB / 50 GB</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full" style={{ width: '9.6%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                  <span>Network Latency</span>
                  <span className="font-semibold text-emerald-400">18 ms</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="space-y-2">
              <div className="text-[11px] text-[var(--color-text-tertiary)] text-center mb-2">
                Workspace Container ID: <span className="font-mono text-cyan-400">orb-neptune-8a54</span>
              </div>
              <button className="w-full py-2.5 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-cyan-400 font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(8,145,178,0.02)] hover:shadow-[0_0_20px_rgba(8,145,178,0.08)] cursor-pointer">
                Restart Container
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <CreateWorkspaceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;
