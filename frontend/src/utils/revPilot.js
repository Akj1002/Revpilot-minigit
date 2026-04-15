import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getAutocompleteSuggestion = async (currentJson) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a JSON data completion engine. 
            Current JSON context:
            ${currentJson}

            Task: Suggest exactly ONE next logical JSON object or entry that fits this schema and pattern.
            Rules:
            1. Return ONLY the raw JSON string.
            2. Do not include markdown code blocks.
            3. Do not explain anything.
            4. Ensure it perfectly matches the existing keys and data types.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("RevPilot Error:", error);
        return null;
    }
};