import { GoogleGenAI, Type } from "@google/genai";
import { Thought, DailyPlayback } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const geminiService = {
  generateDailyPlayback: async (thoughts: Thought[]): Promise<DailyPlayback> => {
    const ai = getAI();
    
    if (!ai) {
      return {
        summary: "AI features are currently unavailable. Please check your API key configuration.",
        themes: ["Configuration Required"],
        date: new Date().toISOString(),
      };
    }

    if (thoughts.length === 0) {
      return {
        summary: "No thoughts captured today. Every day is a fresh start!",
        themes: ["Quiet Day"],
        date: new Date().toISOString(),
      };
    }

    const thoughtsText = thoughts.map(t => `- ${t.content}`).join('\n');
    
    const prompt = `
      Analyze the following thoughts captured by a user today. 
      The user has ADHD, so the thoughts might be fragmented or diverse.
      Provide a gentle, supportive summary of their day and identify 3-5 high-frequency themes or recurring topics.
      
      Thoughts:
      ${thoughtsText}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "A gentle summary of the user's thoughts today.",
              },
              themes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-5 high-frequency themes identified from the thoughts.",
              },
            },
            required: ["summary", "themes"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      return {
        summary: result.summary || "Could not generate summary.",
        themes: result.themes || [],
        date: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        summary: "The stars are a bit cloudy today. I couldn't summarize your thoughts.",
        themes: ["Connection Error"],
        date: new Date().toISOString(),
      };
    }
  }
};
