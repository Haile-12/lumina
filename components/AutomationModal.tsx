
import React, { useState } from 'react';

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Language = 'nodejs' | 'python';

const AutomationModal: React.FC<AutomationModalProps> = ({ isOpen, onClose }) => {
  const [activeLang, setActiveLang] = useState<Language>('python');

  if (!isOpen) return null;

  const nodeSnippet = `
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: 'YOUR_API_KEY' });

async function generateImage(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: '16:9' } }
  });

  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  return part ? \`data:image/png;base64,\${part.inlineData.data}\` : null;
}
  `.trim();

  const pythonSnippet = `
import google.generativeai as genai
import base64

# Setup
genai.configure(api_key="YOUR_API_KEY")

def generate_automation_image(prompt):
    # Select model ('gemini-2.5-flash-image' is great for free tier)
    model = genai.GenerativeModel('gemini-2.5-flash-image')
    
    # Generate content with image config
    response = model.generate_content(
        prompt,
        generation_config={
            "image_config": { "aspect_ratio": "16:9" }
        }
    )

    # Extract image bytes from the response parts
    for part in response.candidates[0].content.parts:
        if hasattr(part, 'inline_data'):
            img_data = part.inline_data.data
            b64 = base64.b64encode(img_data).decode('utf-8')
            return f"data:image/png;base64,{b64}"
            
    return None
  `.trim();

  const currentSnippet = activeLang === 'nodejs' ? nodeSnippet : pythonSnippet;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h2 className="text-xl font-bold">Developer Hub</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col gap-4">
            <p className="text-slate-400 text-sm">
              Copy these snippets into your backend project to automate image generation.
            </p>
            
            {/* Language Tabs */}
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 w-fit">
              <button 
                onClick={() => setActiveLang('python')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeLang === 'python' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <i className="fa-brands fa-python mr-2"></i> Python
              </button>
              <button 
                onClick={() => setActiveLang('nodejs')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeLang === 'nodejs' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <i className="fa-brands fa-node-js mr-2"></i> Node.js
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {activeLang === 'python' ? 'Python SDK (google-generativeai)' : 'TypeScript SDK (@google/genai)'}
              </span>
              <button 
                onClick={() => navigator.clipboard.writeText(currentSnippet)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <i className="fa-solid fa-copy"></i> Copy
              </button>
            </div>
            <pre className="bg-black/50 p-4 rounded-xl border border-slate-800 overflow-x-auto min-h-[200px]">
              <code className={`text-xs font-mono leading-relaxed ${activeLang === 'python' ? 'text-emerald-400' : 'text-indigo-300'}`}>
                {currentSnippet}
              </code>
            </pre>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
            <h4 className="text-indigo-400 text-sm font-bold mb-2 flex items-center gap-2">
              <i className="fa-solid fa-terminal"></i>
              Installation
            </h4>
            <code className="text-xs bg-black/30 px-2 py-1 rounded text-slate-300">
              {activeLang === 'python' ? 'pip install google-generativeai' : 'npm install @google/genai'}
            </code>
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationModal;
