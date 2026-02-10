
import React, { useState } from 'react';

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'sdk' | 'web-trigger';
type Language = 'nodejs' | 'python';

const AutomationModal: React.FC<AutomationModalProps> = ({ isOpen, onClose }) => {
  const [activeMode, setActiveMode] = useState<Mode>('web-trigger');
  const [activeLang, setActiveLang] = useState<Language>('python');

  if (!isOpen) return null;

  const pythonWebTriggerSnippet = `
import webbrowser
import urllib.parse
import time

# Use this method to BYPASS quota limits in your local Python project
# by using the pre-configured environment of the Lumina Web App.

prompt = "A majestic dragon made of liquid gold flying over a volcano"
encoded_prompt = urllib.parse.quote(prompt)

# Construct the auto-generate URL
# Replace with your actual Vercel/Studio URL
url = f"https://your-app-url.vercel.app/?prompt={encoded_prompt}&auto=true"

print(f"Opening browser to generate image: {prompt}")
webbrowser.open(url)

# Note: To fully automate (downloading the image back to Python),
# you would use a headless browser like Playwright or Selenium
# to wait for the element #result-image to appear and grab its 'src'.
  `.trim();

  const pythonSDKSnippet = `
import google.generativeai as genai
import base64
import os

# Warning: This method requires your own billing project and quota.
genai.configure(api_key=os.environ.get("API_KEY"))

def generate_sdk_image(prompt):
    model = genai.GenerativeModel('gemini-2.5-flash-image')
    response = model.generate_content(
        prompt,
        generation_config={"image_config": {"aspect_ratio": "1:1"}}
    )
    # ... handle response as seen in documentation
  `.trim();

  const nodeSnippet = `
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// ... implementation as per Gemini guidelines
  `.trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h2 className="text-xl font-bold">Automation Hub</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 w-full">
            <button 
              onClick={() => setActiveMode('web-trigger')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeMode === 'web-trigger' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Web-Trigger API (Bypass Quota)
            </button>
            <button 
              onClick={() => setActiveMode('sdk')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeMode === 'sdk' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Direct SDK Call
            </button>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
            <i className="fa-solid fa-circle-info text-amber-500 mt-1"></i>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-200">
                {activeMode === 'web-trigger' ? "The 'Zero Quota' Solution" : "Direct SDK Requirement"}
              </h4>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                {activeMode === 'web-trigger' 
                  ? "This method leverages the web app's environment to generate images. Use the 'auto=true' flag to trigger it remotely from your Python script."
                  : "Direct SDK calls require your local API Key to have an active Billing Account linked to the Google Cloud project."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Code Implementation</span>
              <button 
                onClick={() => navigator.clipboard.writeText(activeMode === 'web-trigger' ? pythonWebTriggerSnippet : (activeLang === 'python' ? pythonSDKSnippet : nodeSnippet))}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <i className="fa-solid fa-copy"></i> Copy Snippet
              </button>
            </div>
            <pre className="bg-black/50 p-4 rounded-xl border border-slate-800 overflow-x-auto min-h-[200px]">
              <code className="text-xs font-mono leading-relaxed text-emerald-400">
                {activeMode === 'web-trigger' ? pythonWebTriggerSnippet : (activeLang === 'python' ? pythonSDKSnippet : nodeSnippet)}
              </code>
            </pre>
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
