
import { Persona } from '../types';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PERSONA_DETAILS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mock function to replace the API call for starting a chat.
export const startChat = (persona: Persona): void => {
  console.log(`Chat started with persona: ${persona}`);
  // No-op.
};

// Sends a message to the Gemini API with the appropriate system prompt.
export const sendMessageToGemini = async (message: string, persona: Persona): Promise<string> => {
  console.log(`Sending message to Gemini for persona ${persona}: ${message}`);
  const personaDetails = PERSONA_DETAILS[persona];
  if (!personaDetails) {
    return "Error: Persona details not found.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: personaDetails.systemPrompt,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "ಕ್ಷಮಿಸಿ, ನನ್ನ ಸಂಭಾಷಣೆಯ ಸಾಮರ್ಥ್ಯಗಳಲ್ಲಿ ತಾತ್ಕಾಲಿಕ ದೋಷವಿದೆ. --- Sorry, there's a temporary error with my conversational abilities.";
  }
};

// Mock function to simulate generating an image.
export const generateImageFromPrompt = (prompt: string): Promise<string> => {
  console.log(`Generating image from Unsplash for prompt: ${prompt}`);
  const size = prompt.includes('map') ? '512x512' : '256x256';

  // A more robust way to get relevant keywords from the prompt for Unsplash.
  let keywords = prompt.split(',')[0]; // Fallback to the first part of the prompt
  
  const match = prompt.match(/of (.*?)(?:, | from | in )/);
  if (match && match[1]) {
    keywords = match[1];
  }

  // Add some context for historical figures
  if (prompt.toLowerCase().includes('portrait')) {
      keywords += ",painting,historical";
  }
  if (prompt.toLowerCase().includes('karnataka')) {
      keywords += ",india";
  }

  return Promise.resolve(`https://source.unsplash.com/${size}/?${encodeURIComponent(keywords)}`);
};