
import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-gear"></i>
            </div>
            <h2 className="text-xl font-bold">App Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex gap-3">
            <i className="fa-solid fa-circle-info text-indigo-400 mt-1"></i>
            <p className="text-xs text-indigo-200/70 leading-relaxed">
              API keys are managed securely via environment variables and the Google AI Studio project selection dialog. 
              No manual configuration is required here.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-300">Billing & Projects</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              To use high-quality models, ensure your Google Cloud project has billing enabled. 
              You can find more information in the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 underline">official billing documentation</a>.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
