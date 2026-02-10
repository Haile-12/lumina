
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize, ModelType } from "../types";

export const generateImage = async (
  prompt: string,
  config: {
    aspectRatio: AspectRatio;
    imageSize: ImageSize;
    modelType: ModelType;
  }
): Promise<string> => {
  // Use the API key from environment variable directly in the constructor.
  // Create a new GoogleGenAI instance right before making an API call 
  // to ensure it always uses the most up-to-date API key context.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  // Choose the model based on type.
  // gemini-3-pro-image-preview for high quality (supports 1K-4K), gemini-2.5-flash-image for general tasks.
  const modelName = config.modelType === 'pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  const requestConfig: any = {
    imageConfig: {
      aspectRatio: config.aspectRatio,
    }
  };

  // Only Pro supports explicit imageSize setting (1K, 2K, 4K).
  if (config.modelType === 'pro') {
    requestConfig.imageConfig.imageSize = config.imageSize;
  }

  try {
    // Call generateContent to generate images with nano banana series models.
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }],
      },
      config: requestConfig,
    });

    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("No image was generated.");
    }

    // Find the image part in the response by iterating through all parts to find inlineData.
    // Do not assume the first part is an image part.
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Response did not contain image data.");
  } catch (error: any) {
    console.error("Generation error:", error);
    
    // Check for "Requested entity was not found" error which indicates project/key issues
    // and signals the UI to re-trigger API key selection via openSelectKey().
    if (error.message && error.message.includes("Requested entity was not found")) {
      throw new Error("MODEL_NOT_FOUND");
    }
    
    throw error;
  }
};