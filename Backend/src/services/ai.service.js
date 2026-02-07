import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(content) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
    });

    return response.text;
}

export { generateResponse };
