
import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryProps {
  history: GeneratedImage[];
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
          <i className="fa-regular fa-image text-3xl"></i>
        </div>
        <p className="text-lg">Your art gallery is empty.</p>
        <p className="text-sm">Start generating images to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {history.map((image) => (
        <div 
          key={image.id} 
          className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
        >
          {/* Image Container with specific Aspect Ratio preservation */}
          <div className="relative overflow-hidden bg-slate-950 aspect-square">
            <img 
              src={image.url} 
              alt={image.prompt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex gap-2 justify-end">
                <a 
                  href={image.url} 
                  download={`lumina-art-${image.id}.png`}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-indigo-500 transition-colors border border-white/10"
                  title="Download"
                >
                  <i className="fa-solid fa-download"></i>
                </a>
                <button 
                  onClick={() => onDelete(image.id)}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors border border-white/10"
                  title="Delete"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${image.model === 'pro' ? 'bg-amber-500/20 text-amber-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {image.model === 'pro' ? 'Pro' : 'Std'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase">
                {image.aspectRatio}
              </span>
              <span className="ml-auto text-[10px] text-slate-500">
                {new Date(image.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {image.prompt}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
