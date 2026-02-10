
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
  // Fix: Use process.env.API_KEY directly when initializing the GoogleGenAI client instance as per guidelines.
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  // Use the correct model names according to the guidelines.
  const modelName = config.modelType === 'pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  const requestConfig: any = {
    imageConfig: {
      aspectRatio: config.aspectRatio,
    }
  };

  // gemini-3-pro-image-preview supports imageSize configuration.
  if (config.modelType === 'pro') {
    requestConfig.imageConfig.imageSize = config.imageSize;
  }

  try {
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

    // The output response may contain both image and text parts; iterate through all parts to find the image.
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Response did not contain image data.");
  } catch (error: any) {
    console.error("Generation error:", error);
    
    // Check for "Requested entity was not found" error to signal key re-selection requirement.
    if (error.message && error.message.includes("Requested entity was not found")) {
      throw new Error("MODEL_NOT_FOUND");
    }
    
    throw error;
  }
};