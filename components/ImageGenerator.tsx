
import React, { useState, useEffect, useRef } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio, GenerationSettings, GeneratedImage, StylePreset } from '../types';

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
  remotePrompt?: string | null;
  autoGenerate?: boolean;
}

const STYLE_PRESETS: StylePreset[] = [
  { name: 'Cinematic', suffix: ', cinematic lighting, highly detailed, 8k, realistic', icon: 'fa-film' },
  { name: 'Cyberpunk', suffix: ', cyberpunk aesthetic, neon lights, futuristic, synthwave colors', icon: 'fa-robot' },
  { name: 'Anime', suffix: ', anime style, vibrant colors, studio ghibli inspired, high quality cell shaded', icon: 'fa-clapperboard' },
  { name: 'Oil Painting', suffix: ', oil painting style, visible brush strokes, classical art, masterpiece', icon: 'fa-palette' },
  { name: '3D Render', suffix: ', 3D render, octanerender, unreal engine 5, toy-like, tilt-shift', icon: 'fa-cube' },
  { name: 'Minimalist', suffix: ', minimalist style, clean lines, flat design, vector art', icon: 'fa-feather' },
];

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated, remotePrompt, autoGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '1:1',
    imageSize: '1K',
    model: 'standard'
  });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const autoTriggered = useRef(false);

  // Handle prompt from URL parameters
  useEffect(() => {
    if (remotePrompt) {
      setPrompt(remotePrompt);
    }
  }, [remotePrompt]);

  // Handle Auto-generation
  useEffect(() => {
    if (autoGenerate && prompt && !isGenerating && !autoTriggered.current) {
      autoTriggered.current = true;
      handleGenerate();
    }
  }, [autoGenerate, prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setError(null);
    setIsGenerating(true);

    try {
      if (settings.model === 'pro' && window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }

      const imageUrl = await generateImage(prompt, {
        aspectRatio: settings.aspectRatio,
        imageSize: settings.imageSize,
        modelType: settings.model
      });

      setCurrentImage(imageUrl);
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        aspectRatio: settings.aspectRatio,
        model: settings.model
      };

      onImageGenerated(newImage);
    } catch (err: any) {
      if (err.message === 'MODEL_NOT_FOUND' || (err.message && err.message.includes("Requested entity was not found"))) {
        setError("API access error. Please select a valid paid project API key via the settings dialog.");
        if (window.aistudio) await window.aistudio.openSelectKey();
      } else {
        setError(err.message || "Something went wrong while generating your art.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const applyStyle = (style: StylePreset) => {
    if (!prompt.includes(style.suffix)) {
      setPrompt(prev => prev.trim() + style.suffix);
    }
  };

  const aspectRatios: AspectRatio[] = ['1:1', '4:3', '3:4', '16:9', '9:16'];

  return (
    <div className="space-y-8">
      {autoGenerate && !currentImage && isGenerating && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
           <i className="fa-solid fa-bolt-lightning text-indigo-400"></i>
           <span className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Automated Generation in Progress</span>
        </div>
      )}

      <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Settings Side */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Model Quality</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-700">
                <button 
                  onClick={() => setSettings(s => ({...s, model: 'standard'}))}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${settings.model === 'standard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Standard
                </button>
                <button 
                  onClick={() => setSettings(s => ({...s, model: 'pro'}))}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${settings.model === 'pro' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <i className="fa-solid fa-crown text-[10px]"></i> Pro
                </button>
              </div>
            </div>

            <div id="styles">
              <label className="block text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Style Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.name}
                    onClick={() => applyStyle(style)}
                    className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium border border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all"
                  >
                    <i className={`fa-solid ${style.icon}`}></i>
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setSettings(s => ({...s, aspectRatio: ratio}))}
                    className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all ${settings.aspectRatio === ratio ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'}`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {settings.model === 'pro' && (
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Output Size</label>
                <div className="flex gap-2">
                  {['1K', '2K', '4K'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSettings(s => ({...s, imageSize: size as any}))}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${settings.imageSize === size ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generator Side */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <div className="relative group">
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your masterpiece... e.g., 'A bioluminescent forest with crystal streams'"
                className="w-full h-32 md:h-40 bg-slate-900/50 border border-slate-700 rounded-2xl p-5 text-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none shadow-inner"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={() => setPrompt('')}
                  className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Clear Prompt"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <button
                id="generate-button"
                disabled={isGenerating || !prompt.trim()}
                onClick={handleGenerate}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
                  isGenerating || !prompt.trim() 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/20'
                }`}
              >
                {isGenerating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Crafting your vision...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-sparkles"></i>
                    Generate Art
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Preview */}
      {(currentImage || isGenerating) && (
        <div className="flex flex-col items-center">
          <div id="generation-container" className={`relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${isGenerating ? 'loading-gradient min-h-[400px]' : 'bg-slate-900'}`}>
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse italic">Thinking of colors and shapes...</p>
              </div>
            ) : currentImage ? (
              <>
                <img 
                  id="result-image"
                  src={currentImage} 
                  alt="Generated" 
                  className="w-full h-auto object-contain animate-in fade-in zoom-in duration-500" 
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <a 
                    href={currentImage} 
                    download={`lumina-art-${Date.now()}.png`}
                    className="p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-all border border-white/10"
                    title="Download"
                  >
                    <i className="fa-solid fa-download"></i>
                  </a>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
