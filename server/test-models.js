import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // For some SDK versions, we might need to access the model manager differently.
        // Ideally, we just want to verify connectivity.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Attempting to generate content with gemini-1.5-flash...");
        const result = await model.generateContent("Test");
        console.log("Success! Response:", result.response.text());
    } catch (e) {
        console.error("Error with gemini-1.5-flash:", e.message);

        console.log("\nAttempting to create a fallback model (gemini-pro)...");
        try {
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent("Test");
            console.log("Success with gemini-pro! Response:", result2.response.text());
        } catch (e2) {
            console.error("Error with gemini-pro:", e2.message);
        }
    }
}

listModels();
