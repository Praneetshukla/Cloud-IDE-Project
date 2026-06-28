import { HiOutlineFolder, HiOutlineFolderOpen, HiOutlineDocumentText } from 'react-icons/hi';
import { SiJavascript, SiTypescript, SiPython, SiReact, SiJson, SiMarkdown } from 'react-icons/si';
import { FaHtml5, FaCss3Alt } from 'react-icons/fa';

const FileIcon = ({ type, name, isOpen = false }) => {
  if (type === 'folder') {
    return isOpen ? (
      <HiOutlineFolderOpen className="h-4 w-4 text-indigo-400 shrink-0" />
    ) : (
      <HiOutlineFolder className="h-4 w-4 text-indigo-400 shrink-0" />
    );
  }

  const ext = name.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'js': return <SiJavascript className="h-3.5 w-3.5 text-yellow-400 shrink-0" />;
    case 'jsx': return <SiReact className="h-3.5 w-3.5 text-cyan-400 shrink-0" />;
    case 'ts': return <SiTypescript className="h-3.5 w-3.5 text-blue-400 shrink-0" />;
    case 'tsx': return <SiReact className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
    case 'py': return <SiPython className="h-3.5 w-3.5 text-blue-400 shrink-0" />;
    case 'html': return <FaHtml5 className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
    case 'css': return <FaCss3Alt className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
    case 'json': return <SiJson className="h-3.5 w-3.5 text-green-400 shrink-0" />;
    case 'md': return <SiMarkdown className="h-3.5 w-3.5 text-slate-300 shrink-0" />;
    default: return <HiOutlineDocumentText className="h-4 w-4 text-slate-400 shrink-0" />;
  }
};

export default FileIcon;
