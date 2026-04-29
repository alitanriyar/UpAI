import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, TaskType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const verifyTask = async (
  taskType: TaskType,
  mediaData: { data: string; mimeType: string } | { data: string; mimeType: string }[] | string
): Promise<AIResponse> => {
  const model = "gemini-3-flash-preview";

  let prompt = "";
  let systemInstruction = "";

  if (taskType === 'coffee') {
    systemInstruction = `You are an image verification AI for a morning ritual app.
Determine if the user is holding or showing a cup of coffee.
Approve if a cup, mug, or container clearly meant for coffee is visible.
The presence of steam or a dark liquid helps verification.
Reject if the image is too blurry to identify anything or if no cup is visible.
Return JSON strictly: {"approved": boolean, "confidence": number, "reason": string, "retry_instruction": string}.`;
    prompt = "Show your coffee clearly to the camera. Is there a coffee cup in the frame?";
  } else if (taskType === 'movement') {
    systemInstruction = `You are a movement detection AI.
The user must stand where their full body (or at least most of it) is visible and do 5 squats.
Verify if the user is visible and performing a clear up-and-down motion.
I am providing a sequence of images from a 7-second recording.
Approve if there is clear vertical movement of the torso/body.
Reject if the user is static, invisible, or if the camera view is completely blocked.
Return JSON strictly: {"approved": boolean, "confidence": number, "reason": string, "retry_instruction": string}.`;
    prompt = "Analyze this sequence: Is the user performing squats or clear up-and-down body movement?";
  } else if (taskType === 'brush') {
    systemInstruction = `Detect the user performing their "Smile" ritual (brushing teeth).
Approve if:
1. A toothbrush is visible near the mouth.
2. The user is actively brushing.
3. The user's face is clearly visible.
Reject if the face is hidden, no toothbrush is seen, or there is no movement.
Return JSON strictly: {"approved": boolean, "confidence": number, "reason": string, "retry_instruction": string}.`;
    prompt = "Is the user brushing their teeth or showing their morning smile with a toothbrush?";
  } else if (taskType === 'affirmation') {
    systemInstruction = `You are an audio verification AI.
The user must say exactly or very close to: "I am grateful, I am happy, I am healthy, I am lucky."
Approve ONLY if the user says these specific words or a very close variation.
Reject if they say something unrelated, remain silent, or don't complete the full sentence.
Be slightly lenient with accents but strict on the content.
Return JSON strictly: {"approved": boolean, "confidence": number, "reason": string, "retry_instruction": string}.`;
    prompt = `Listen to the audio and verify if the user says the affirmation: "I am grateful, I am happy, I am healthy, I am lucky."`;
  }

  try {
    let parts: any[] = [];
    
    if (typeof mediaData === 'string') {
      parts.push({ text: mediaData });
    } else if (Array.isArray(mediaData)) {
      mediaData.forEach(item => {
        parts.push({ inlineData: item });
      });
      parts.push({ text: prompt });
    } else {
      parts.push({ inlineData: mediaData });
      parts.push({ text: prompt });
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            approved: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            retry_instruction: { type: Type.STRING },
            detected_text: { type: Type.STRING },
            rep_count: { type: Type.NUMBER },
          },
          required: ["approved", "confidence", "reason", "retry_instruction"]
        }
      }
    });

    return JSON.parse(response.text) as AIResponse;
  } catch (error) {
    console.error("AI Verification Error:", error);
    return {
      approved: false,
      confidence: 0,
      reason: "Could not process verification. Please try again.",
      retry_instruction: "Check lighting and camera position."
    };
  }
};
