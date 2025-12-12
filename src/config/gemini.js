import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// Vite/Netlify environment variable
// Must start with "VITE_"
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODEL_NAME = "gemini-2.5-flash";

async function runChat(prompt) {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: "You are a helpful and concise AI assistant."
        });

        const generationConfig = {
            temperature: 1,
            topK: 64,
            topP: 0.95,
            maxOutputTokens: 8192,
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [],
        });

        const result = await chat.sendMessage(prompt);
        return result.response.text();

    } catch (error) {
        console.error("Error:", error);
        return "Error generating response";
    }
}

export default runChat;
