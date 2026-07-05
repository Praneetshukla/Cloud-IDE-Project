import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineCode, HiOutlineTerminal, HiOutlineLightningBolt, HiOutlineTrash } from 'react-icons/hi';
import { SiJavascript, SiTypescript, SiPython, SiReact, SiNodedotjs } from 'react-icons/si';
import { FaHtml5 } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { fetchWorkspaces } from '../../redux/slices/workspaceSlice';
import { fetchRecentProjects, fetchProjects, fetchTrashedProjects, restoreProject, hardDeleteProject } from '../../redux/slices/projectSlice';
import { fetchStats } from '../../redux/slices/userSlice';
import WorkspaceCard from '../../components/common/WorkspaceCard';
import ProjectCard from '../../components/common/ProjectCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CreateWorkspaceModal from '../../components/workspaces/CreateWorkspaceModal';
import CreateFromTemplateModal from '../../components/projects/CreateFromTemplateModal';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const location = useLocation();
  const hash = location.hash || '#overview';

  const { workspaces, isLoading: wsLoading } = useSelector((state) => state.workspace);
  const { recentProjects, projects, trashedProjects, isLoading: projLoading } = useSelector((state) => state.project);
  const { stats } = useSelector((state) => state.user);

  const [filter, setFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
    dispatch(fetchRecentProjects());
    dispatch(fetchStats());
    dispatch(fetchProjects({
      search: searchQuery || undefined,
      language: filter === 'all' ? undefined : filter
    }));
    if (hash === '#trash') {
      dispatch(fetchTrashedProjects());
    }
  }, [dispatch, searchQuery, filter, hash]);

  const navigate = useNavigate();

  const quickActions = [
    { icon: HiOutlinePlus, title: 'New Workspace', description: 'Create a blank workspace', color: 'from-cyan-400 to-cyan-600', onClick: () => setIsCreateModalOpen(true) },
    { icon: HiOutlineCode, title: 'Your Projects', description: 'View all projects', color: 'from-teal-400 to-emerald-600', onClick: () => navigate('#projects') },
    {
      icon: HiOutlineTerminal, title: 'Editor', description: 'Open your last project', color: 'from-fuchsia-400 to-purple-600', onClick: () => {
        if (recentProjects.length > 0) {
          navigate(`/editor/${recentProjects[0]._id}`);
        } else {
          toast('No recent projects found', { icon: 'ℹ️' });
        }
      }
    },
    { icon: HiOutlineLightningBolt, title: 'Settings', description: 'Manage preferences', color: 'from-amber-400 to-orange-600', onClick: () => navigate('/profile') },
  ];

  const displayedProjects = (searchQuery || filter !== 'all' || hash === '#projects') ? projects : recentProjects.slice(0, 4);
  const favoriteProjects = (projects || []).filter(p => p?.isFavorite);
  const sharedProjects = (projects || []).filter(p => {
    if (!p || !p.owner) return false;
    const ownerId = String(typeof p.owner === 'object' ? (p.owner._id || p.owner.id) : p.owner);
    const currentUserId = String(user?._id || user?.id);
    return ownerId !== currentUserId;
  });

  const templateOptions = [
    { value: 'react', label: 'React.js', icon: <SiReact className="text-cyan-400 h-6 w-6" />, desc: 'Modern UI development' },
    { value: 'node', label: 'Node.js', icon: <SiNodedotjs className="text-green-500 h-6 w-6" />, desc: 'Backend API server' },
    { value: 'python', label: 'Python', icon: <SiPython className="text-blue-400 h-6 w-6" />, desc: 'Data science & scripting' },
    { value: 'html', label: 'HTML/CSS/JS', icon: <FaHtml5 className="text-orange-500 h-6 w-6" />, desc: 'Static website' },
    { value: 'javascript', label: 'Vanilla JS', icon: <SiJavascript className="text-yellow-400 h-6 w-6" />, desc: 'Empty JS project' }
  ];

  if (wsLoading && !workspaces.length) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]"><LoadingSpinner /></div>;
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto relative z-10 animate-fade-in-up">
      {/* Welcome */}
      {!searchQuery && hash === '#overview' && (
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
          {!searchQuery && hash === '#overview' && (
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

          {/* Projects Section (Overview or #projects) */}
          {(hash === '#overview' || hash === '#projects') && (
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
                      className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${filter === lang
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
          )}

          {/* Workspaces Section (Overview or #workspaces) */}
          {!searchQuery && (hash === '#overview' || hash === '#workspaces') && (
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

          {/* Favorites Section */}
          {hash === '#favorites' && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">Favorites</h2>

              {projLoading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
              ) : favoriteProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProjects.map(project => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="bg-surface/10 rounded-xl border border-white/5 border-dashed p-12 text-center">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">No favorites yet</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Star a project to see it here.</p>
                </div>
              )}
            </div>
          )}

          {/* Shared with Me Section */}
          {hash === '#shared' && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">Shared with Me</h2>
              
              {projLoading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
              ) : sharedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sharedProjects.map((project, idx) => (
                    <div key={project._id} className={`animate-fade-in-up animation-delay-${(idx % 10) * 100}`}>
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface/10 rounded-xl border border-white/5 border-dashed p-12 text-center">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">Nothing shared yet</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Projects shared by others will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* Templates Section */}
          {hash === '#templates' && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">Project Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templateOptions.map((template, idx) => (
                  <button
                    key={template.value}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setIsTemplateModalOpen(true);
                    }}
                    className={`group relative flex flex-col items-center justify-center p-8 rounded-xl border border-white/10 bg-surface/30 backdrop-blur-md hover:border-cyan-500/50 hover-lift hover-glow transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in-up animation-delay-${(idx + 1) * 100}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{template.icon}</div>
                    <h3 className="relative z-10 text-lg font-bold text-[var(--color-text-primary)]">{template.label}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recycle Bin Section */}
          {hash === '#trash' && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6 text-rose-400 flex items-center gap-2">
                <HiOutlineTrash className="h-6 w-6" /> Recycle Bin
              </h2>

              {projLoading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
              ) : trashedProjects?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trashedProjects.map(project => (
                    <div key={project._id} className="relative group bg-surface/20 border border-white/5 rounded-xl p-5 hover-lift transition-all duration-300 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)] line-through opacity-70">{project.name}</h3>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 bg-rose-500/10 px-2 py-1 rounded">Deleted</span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1 opacity-70">{project.description || 'No description'}</p>
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => {
                            dispatch(restoreProject(project._id));
                            toast.success('Project restored!');
                          }}
                          className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded transition-colors cursor-pointer"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to PERMANENTLY delete this project? This cannot be undone.')) {
                              dispatch(hardDeleteProject(project._id));
                              toast.success('Project permanently deleted.');
                            }
                          }}
                          className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-semibold rounded transition-colors cursor-pointer"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface/10 rounded-xl border border-white/5 border-dashed p-12 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 flex items-center justify-center mb-4">
                    <HiOutlineTrash className="h-8 w-8 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">Recycle Bin is empty</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">No deleted projects found.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column (Compute Health Monitor & Widgets) - Columns 9-12 */}
        <div className="lg:col-span-4 space-y-6">



          {/* Activity Feed */}
          <div className="group relative bg-surface/30 backdrop-blur-md border border-white/5 rounded-xl p-6 overflow-hidden animate-fade-in-up animation-delay-100 hover-lift hover-glow transition-all duration-300 cursor-default">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Recent Activity
            </h3>

            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {recentProjects.length > 0 ? (
                recentProjects.slice(0, 4).map((project, idx) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/editor/${project._id}`)}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-indigo-500/20 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-0 md:ml-0 z-10">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-white/5 bg-white/[0.02] shadow-sm ml-4 md:ml-0 hover:bg-white/[0.05] transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-xs text-[var(--color-text-primary)]">Edited Project</span>
                        <span className="text-[10px] text-[var(--color-text-tertiary)]">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">"{project.name}"</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-[var(--color-text-secondary)] text-sm relative z-10 bg-surface/10 rounded-xl">
                  No recent activity
                </div>
              )}
            </div>
          </div>

          {/* Developer Profile / Stats */}
          <div className="group relative bg-surface/30 backdrop-blur-md border border-white/5 rounded-xl p-6 overflow-hidden animate-fade-in-up animation-delay-200 hover-lift hover-glow transition-all duration-300 cursor-default">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">Your Profile Stats</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col items-center justify-center hover:bg-white/[0.05] transition-colors">
                <span className="text-xl font-bold text-cyan-400">{stats?.projects || projects.length || 0}</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider mt-1">Projects</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col items-center justify-center hover:bg-white/[0.05] transition-colors">
                <span className="text-xl font-bold text-fuchsia-400">{stats?.workspaces || workspaces.length || 0}</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider mt-1">Workspaces</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col items-center justify-center hover:bg-white/[0.05] transition-colors">
                <span className="text-xl font-bold text-emerald-400">{stats?.commits || 0}</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider mt-1">Commits</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col items-center justify-center hover:bg-white/[0.05] transition-colors">
                <span className="text-xl font-bold text-amber-400">{stats?.terminalSessions || 0}</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider mt-1">Terminals</span>
              </div>
            </div>

            <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-3">Tech Stack (Projects)</h3>

            {/* Tech Stack Breakdown */}
            {projects.length > 0 ? (
              <div className="space-y-3">
                {Object.entries(
                  projects.reduce((acc, p) => {
                    const lang = p.language?.toLowerCase() || 'other';
                    acc[lang] = (acc[lang] || 0) + 1;
                    return acc;
                  }, {})
                ).sort((a, b) => b[1] - a[1]).map(([lang, count]) => (
                  <div key={lang} className="flex justify-between text-xs items-center group">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-sm ${lang === 'react' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' :
                          lang === 'node' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                            lang === 'python' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                              lang === 'javascript' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]' :
                                'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.5)]'
                        }`}></span>
                      <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors capitalize">{lang}</span>
                    </div>
                    <span className="text-[var(--color-text-primary)] font-medium bg-white/[0.03] px-2 py-0.5 rounded">{Math.round((count / projects.length) * 100)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-xs text-[var(--color-text-tertiary)] italic py-4 bg-white/[0.01] rounded-lg border border-white/5">
                Create projects to see your stack
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modals */}
      <CreateWorkspaceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <CreateFromTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

export default DashboardPage;
