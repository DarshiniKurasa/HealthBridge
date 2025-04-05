import { log } from "./vite";

/**
 * Utility functions for interacting with Google's Gemini API
 */

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";

/**
 * Makes a request to the Gemini API with the provided prompt
 * @param prompt The text prompt to send to Gemini
 * @returns The response text from Gemini
 */
export async function queryGeminiModel(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("Gemini API key not found");
    }
    
    const url = `${GEMINI_API_ENDPOINT}?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      log(`Gemini API error: ${JSON.stringify(errorData)}`, "gemini");
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }
    
    // Extract the response text from the first candidate
    const responseText = data.candidates[0].content.parts[0].text;
    return responseText;
    
  } catch (error) {
    log(`Error querying Gemini: ${error}`, "gemini");
    throw error;
  }
}

/**
 * Get medical symptom analysis from Gemini
 * @param symptoms Array of symptom descriptions
 * @returns Analysis and possible conditions
 */
export async function analyzeSymptoms(symptoms: string[]): Promise<string> {
  const prompt = `
  Act as a preliminary healthcare assistant providing information about possible medical conditions. 
  
  I'm experiencing the following symptoms:
  ${symptoms.join(", ")}
  
  Based on these symptoms only, what might be some potential conditions to discuss with a healthcare provider?
  
  Provide 2-3 possible conditions with brief explanations. Format your response as bullet points.
  
  End with a clear disclaimer that this is not a diagnosis and the user should consult a healthcare professional.
  `;
  
  return await queryGeminiModel(prompt);
}

/**
 * Process a mental health support message with Gemini
 * @param userMessage The user's message
 * @param conversationHistory Previous messages in the conversation
 * @returns AI response to the user's mental health concern
 */
export async function processMentalHealthMessage(
  userMessage: string,
  conversationHistory: string = ""
): Promise<string> {
  const prompt = `
  You are a compassionate mental health support assistant. Your role is to provide supportive responses, 
  active listening, and guidance for managing mental health concerns. You are not a therapist or doctor,
  and you should make this clear in your interactions.
  
  Previous conversation:
  ${conversationHistory}
  
  User: ${userMessage}
  
  Provide a supportive, empathetic response that:
  1. Acknowledges the user's feelings
  2. Offers supportive perspective or gentle guidance
  3. If appropriate, suggests simple coping strategies
  4. Does not diagnose or prescribe treatment
  
  Be warm, conversational, and genuinely supportive without being overly formal or clinical.
  `;
  
  return await queryGeminiModel(prompt);
}