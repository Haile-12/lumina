
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import History from './components/History';
import AutomationModal from './components/AutomationModal';
import { GeneratedImage } from './types';

const INSPIRATION_PROMPTS = [
  "A majestic dragon made of stained glass, sunlight streaming through its wings, high fantasy",
  "Cyberpunk street market in Tokyo at night, vibrant neon signs, rainy reflections",
  "An astronaut sitting on a park bench on the moon, looking at the distant earth, cosmic art",
  "A tree where the leaves are glowing butterflies, enchanted forest, ethereal atmosphere",
  "Retro-futuristic travel poster for a vacation on Mars, 1950s style",
  "A cozy library with floating books and a magical fireplace, dark academia aesthetic"
];

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [shouldAutoGenerate, setShouldAutoGenerate] = useState(false);

  useEffect(() => {
    // Load history
    const savedHistory = localStorage.getItem('lumina_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // Check for "Remote Call" via URL Params
    const params = new URLSearchParams(window.location.search);
    const remotePrompt = params.get('prompt');
    const auto = params.get('auto') === 'true';
    
    if (remotePrompt) {
      setInitialPrompt(decodeURIComponent(remotePrompt));
      if (auto) {
        setShouldAutoGenerate(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_history', JSON.stringify(history));
  }, [history]);

  const addImageToHistory = (image: GeneratedImage) => {
    setHistory(prev => [image, ...prev]);
  };

  const deleteImage = (id: string) => {
    setHistory(prev => prev.filter(img => img.id !== id));
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire creation history?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-12 scroll-smooth">
      <Header 
        onOpenAutomation={() => setIsAutomationOpen(true)} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 space-y-16 max-w-6xl">
        {/* Generator Section */}
        <section id="create">
          <ImageGenerator 
            onImageGenerated={addImageToHistory} 
            remotePrompt={initialPrompt}
            autoGenerate={shouldAutoGenerate}
          />
        </section>

        {/* Inspiration Section */}
        <section id="inspiration" className="pt-8 border-t border-slate-800">
          <div className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <i className="fa-solid fa-lightbulb text-amber-400"></i>
              Get Inspired
            </h2>
            <p className="text-slate-400 text-sm">Need a starting point? Try one of these prompts to ignite your creativity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INSPIRATION_PROMPTS.map((prompt, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
                onClick={() => {
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-slate-300 italic group-hover:text-white transition-colors line-clamp-2">
                    "{prompt}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-indigo-400"></i>
              Your Gallery
            </h2>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-trash-can"></i>
                Clear All
              </button>
            )}
          </div>
          
          <History history={history} onDelete={deleteImage} />
        </section>
      </main>

      <footer className="mt-20 border-t border-slate-800 pt-12 text-center">
        <div className="flex justify-center gap-8 mb-6">
          <a href="https://ai.google.dev" target="_blank" className="text-slate-500 hover:text-white transition-colors text-sm">Google AI</a>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-slate-500 hover:text-white transition-colors text-sm">Billing</a>
          <a href="https://github.com" target="_blank" className="text-slate-500 hover:text-white transition-colors text-sm">Github</a>
        </div>
        <p className="text-slate-600 text-xs">&copy; {new Date().getFullYear()} Lumina AI Art Studio. Built with Gemini 2.5 & 3.0.</p>
      </footer>

      <AutomationModal isOpen={isAutomationOpen} onClose={() => setIsAutomationOpen(false)} />
    </div>
  );
};

export default App;
