import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY is not set in .env");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Fetching available models from:", url.replace(API_KEY, "HIDDEN_KEY"));

async function checkModels() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }

        const data = await response.json();
        if (data.models) {
            console.log("\nAvailable Models:");
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods})`);
                }
            });
        } else {
            console.log("No models found in response:", data);
        }

    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

checkModels();
