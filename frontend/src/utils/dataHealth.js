import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeDataHealth = async (jsonData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
            Analyze this JSON dataset for data integrity.
            Dataset: ${JSON.stringify(jsonData).substring(0, 2000)} 
            
            Return ONLY a JSON object with these keys:
            {
              "score": number (0-100),
              "status": "Healthy" | "Degraded" | "Critical",
              "issues": ["issue 1", "issue 2"],
              "suggestions": ["fix 1"]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text().replace(/```json|```/g, ""));
    } catch (error) {
        console.error("Health Check Failed:", error);
        return { score: 0, status: "Unknown", issues: ["Could not reach AI engine"], suggestions: [] };
    }
};