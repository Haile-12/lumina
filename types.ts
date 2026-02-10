
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';
export type ModelType = 'standard' | 'pro';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: AspectRatio;
  model: ModelType;
}

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  model: ModelType;
}

export interface StylePreset {
  name: string;
  suffix: string;
  icon: string;
}

declare global {
  /**
   * Define the AIStudio interface in the global scope to ensure it matches
   * the environment's expected type.
   */
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    /**
     * Use the AIStudio interface for the aistudio property.
     * Modifiers must match between declarations of the same interface.
     */
    // Fix: Added readonly modifier to match the platform's global window.aistudio definition and resolve modifier mismatch
    readonly aistudio: AIStudio;
  }
}