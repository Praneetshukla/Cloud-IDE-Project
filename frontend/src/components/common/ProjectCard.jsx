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
    <div className="group flex flex-col bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-lg hover:border-indigo-500/30 transition-all duration-300">
      
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
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

      <div className="px-4 py-3 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
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
