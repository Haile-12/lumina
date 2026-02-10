
import React from 'react';

interface HeaderProps {
  onOpenAutomation: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAutomation }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-800 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-wand-magic-sparkles text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Lumina<span className="gradient-text font-black">AI</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => scrollTo('inspiration')} 
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Discover
          </button>
          <button 
            onClick={onOpenAutomation}
            className="text-slate-300 hover:text-indigo-400 transition-colors text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50"
          >
            <i className="fa-solid fa-code text-xs"></i>
            Automation
          </button>
          <div className="h-6 w-px bg-slate-800 mx-1"></div>
          <a 
            href="https://ai.google.dev/gemini-api/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm font-bold border border-indigo-500/50 text-white"
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;