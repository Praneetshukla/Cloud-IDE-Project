import { Link } from 'react-router-dom';
import { HiOutlineDotsVertical, HiOutlineClock, HiOutlineStar, HiStar } from 'react-icons/hi';
import { SiJavascript, SiTypescript, SiPython, SiReact, SiNodedotjs } from 'react-icons/si';
import { FaHtml5 } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';

const getLanguageIcon = (language) => {
  switch (language) {
    case 'javascript': return <SiJavascript className="text-yellow-400 h-5 w-5" />;
    case 'typescript': return <SiTypescript className="text-blue-500 h-5 w-5" />;
    case 'python': return <SiPython className="text-blue-400 h-5 w-5" />;
    case 'react': return <SiReact className="text-cyan-400 h-5 w-5" />;
    case 'node': return <SiNodedotjs className="text-green-500 h-5 w-5" />;
    case 'html': return <FaHtml5 className="text-orange-500 h-5 w-5" />;
    default: return <div className="h-5 w-5 rounded bg-gray-500" />;
  }
};

const ProjectCard = ({ project }) => {
  return (
    <div className="group relative flex flex-col bg-surface/30 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden hover:border-cyan-500/30 hover:shadow-hologram hover:-translate-y-1 transition-all duration-300">
      
      {/* Center Spotlight radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

      {/* Top laser line accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="p-4 flex-1 relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 group-hover:border-indigo-500/20 transition-all duration-300">
            {getLanguageIcon(project.language)}
          </div>
          <div className="flex items-center gap-1">
            <button className="text-[var(--color-text-tertiary)] hover:text-amber-400 p-1 rounded-md transition-colors cursor-pointer">
              {project.isFavorite ? <HiStar className="h-5 w-5 text-amber-400" /> : <HiOutlineStar className="h-5 w-5" />}
            </button>
            <button className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition-colors cursor-pointer">
              <HiOutlineDotsVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Link to={`/editor/${project._id}`} className="block">
          <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-indigo-400 transition-colors truncate">
            {project.name}
          </h3>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1 truncate">
            {project.workspace?.name || 'Unknown Workspace'}
          </p>
        </Link>
      </div>

      <div className="px-4 py-3 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-xs text-[var(--color-text-tertiary)] relative z-10">
        <div className="flex items-center gap-1.5">
          <HiOutlineClock className="h-3.5 w-3.5" />
          <span>{formatDate(project.lastAccessed)}</span>
        </div>
        <span className="capitalize">{project.language}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
