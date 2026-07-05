import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDotsVertical, HiOutlineClock, HiOutlineStar, HiStar, HiOutlineTrash, HiOutlineExternalLink } from 'react-icons/hi';
import { SiJavascript, SiTypescript, SiPython, SiReact, SiNodedotjs } from 'react-icons/si';
import { FaHtml5 } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';
import { useDispatch } from 'react-redux';
import { toggleProjectFavorite, deleteProject } from '../../redux/slices/projectSlice';
import { MagneticCard } from './MagneticCard';

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
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleProjectFavorite(project._id));
    setIsMenuOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(project._id));
    }
    setIsMenuOpen(false);
  };

  return (
    <MagneticCard className="group bg-surface/30 backdrop-blur-md border border-white/5 rounded-xl p-5 cursor-pointer">
      <div 
        className="relative z-10 w-full h-full flex flex-col"
        onClick={() => window.location.href = `/editor/${project._id}`}
      >
        {/* Top laser line accent */}
        <div className="absolute top-[-20px] left-[-20px] w-[calc(100%+40px)] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 group-hover:border-indigo-500/20 transition-all duration-300">
            {getLanguageIcon(project.language)}
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleFavoriteClick}
              className="text-[var(--color-text-tertiary)] hover:text-amber-400 p-1 rounded-md transition-colors cursor-pointer"
            >
              {project.isFavorite ? <HiStar className="h-5 w-5 text-amber-400" /> : <HiOutlineStar className="h-5 w-5" />}
            </button>
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition-colors cursor-pointer"
              >
                <HiOutlineDotsVertical className="h-5 w-5" />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-surface border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden py-1 animate-fade-in-up origin-top-right">
                  <a 
                    href={`/editor/${project._id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HiOutlineExternalLink className="h-4 w-4" /> Open Project
                  </a>
                  <button 
                    onClick={handleFavoriteClick}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-amber-400 cursor-pointer"
                  >
                    {project.isFavorite ? <HiStar className="h-4 w-4 text-amber-400" /> : <HiOutlineStar className="h-4 w-4" />}
                    {project.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </button>
                  <div className="h-px bg-white/5 my-1" />
                  <button 
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    <HiOutlineTrash className="h-4 w-4" /> Delete Project
                  </button>
                </div>
              )}
            </div>
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

        <div className="px-4 py-3 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-xs text-[var(--color-text-tertiary)] relative z-10 mt-auto">
          <div className="flex items-center gap-1.5">
            <HiOutlineClock className="h-3.5 w-3.5" />
            <span>{formatDate(project.lastAccessed)}</span>
          </div>
          <span className="capitalize">{project.language}</span>
        </div>
      </div>
    </MagneticCard>
  );
};

export default ProjectCard;
