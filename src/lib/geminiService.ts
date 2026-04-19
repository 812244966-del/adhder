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
        summary: "AI 功能目前不可用。请检查您的 API 密钥配置。",
        themes: ["需要配置"],
        date: new Date().toISOString(),
      };
    }

    if (thoughts.length === 0) {
      return {
        summary: "今天还没有记录任何思绪。每一天都是一个新的开始！",
        themes: ["宁静的一天"],
        date: new Date().toISOString(),
      };
    }

    const thoughtsText = thoughts.map(t => `- ${t.content}`).join('\n');
    
    const prompt = `
      分析用户今天记录的以下思绪。
      用户患有 ADHD，因此思绪可能是碎片化或多样化的。
      请对他们的一天提供一个温和、支持性的总结，并识别出 3-5 个高频主题或重复出现的话题。
      
      请务必使用中文（简体）进行回复。

      思绪内容：
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
        summary: result.summary || "无法生成总结。",
        themes: result.themes || [],
        date: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        summary: "今天的星空有点模糊，我无法总结您的思绪。",
        themes: ["连接错误"],
        date: new Date().toISOString(),
      };
    }
  }
};
