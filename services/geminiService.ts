import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL, SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVideoIdeas = async (topic: string): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `Generate 5 viral TikTok video ideas for the topic: "${topic}". 
      Focus on high-retention hooks. 
      Return JSON format with 'ideas' array containing objects with 'hook' and 'angle' properties.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  angle: { type: Type.STRING },
                },
                required: ["hook", "angle"],
              },
            },
          },
        },
      },
    });
    
    const json = JSON.parse(response.text || '{}');
    return json.ideas || [];
  } catch (error) {
    console.error("Error generating ideas:", error);
    throw error;
  }
};

export const generateScript = async (idea: string, duration: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `Write a viral TikTok script for this idea: "${idea}". 
      Target duration: ${duration}.
      Format it with specific visual cues in brackets [Visual] and spoken audio in bold **Audio**.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text || "Failed to generate script.";
  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
};

export const generateMetadata = async (script: string): Promise<{ caption: string; hashtags: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `Based on this script, generate a catchy caption (under 100 chars) and 10 viral hashtags.
      Script: "${script.substring(0, 500)}..."`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
        },
      },
    });
    
    const json = JSON.parse(response.text || '{}');
    return {
      caption: json.caption || "",
      hashtags: json.hashtags || []
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    throw error;
  }
};

export const generateThumbnail = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_IMAGE_MODEL,
      contents: {
        parts: [
          { text: `Create a high-contrast, click-baity TikTok thumbnail background for: ${prompt}. Vibrant colors, neon aesthetic.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      } else if (part.text) {
        console.warn("Model returned text instead of image:", part.text);
      }
    }
    
    // If we get here, no image was generated. This might be a safety refusal.
    if (parts.length > 0 && parts[0].text) {
        throw new Error(`Model refused to generate image: ${parts[0].text}`);
    }
    
    return null;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw error;
  }
};