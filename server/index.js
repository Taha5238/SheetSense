import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = 3000;

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get('/', (req, res) => {
    res.send('SheetSense Backend is running');
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const ACTION_SCHEMA = `
You are an AI assistant for Microsoft Excel. Your job is to translate user requests into JSON actions that can be executed by the Excel Add-in.

Return a JSON OBJECT with a key "actions" containing an ARRAY of action objects.
Do NOT return markdown. Return ONLY raw JSON.

Supported Actions:

1. **editCell**
   - description: Write values or formulas to specific cells.
   - properties:
     - address: string (e.g., "A1", "B2:C5")
     - values: array of array of strings/numbers (row-major). 
     - isFormula: boolean (true if values start with "=")

2. **formatRange**
   - description: Apply formatting to a range.
   - properties:
     - address: string (e.g., "A1:Z1")
     - format: object containing:
       - fill: string (hex color e.g., "#FF0000")
       - fontColor: string (hex color)
       - bold: boolean
       - italic: boolean
       - fontSize: number
       - numberFormat: string (e.g., "$#,##0.00", "0.00%")
       - horizontalAlignment: "Left" | "Center" | "Right"
       - columnWidth: "AutoFit" | number

3. **createTable**
   - description: Turn a range into a table.
   - properties:
     - address: string
     - hasHeaders: boolean
     - name: string (optional)

4. **createChart**
   - description: Create a chart from data.
   - properties:
     - dataRange: string
     - type: "ColumnClustered" | "Line" | "Pie" | "BarClustered"
     - title: string
     - seriesBy: "Auto" | "Rows" | "Columns"

5. **addWorksheet**
   - description: Add a new sheet.
   - properties:
     - name: string

6. **freezePanes**
    - description: Freeze rows or columns
    - properties:
      - type: "Row" | "Column"
      - count: number (e.g., 1 for top row)
`;

        const fullPrompt = `${ACTION_SCHEMA}\n\nContext: ${context || "No context provided"}\nUser Request: "${message}"\n\nJSON Response:`;

        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        // Clean markdown
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsed = JSON.parse(cleanJson);
            res.json(parsed);
        } catch (e) {
            console.error("Failed to parse JSON:", responseText);
            res.status(500).json({ error: "Failed to parse AI response", raw: responseText });
        }

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/voice', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const audioBase64 = req.file.buffer.toString('base64');
        const { context } = req.body;

        const ACTION_SCHEMA = `
You are an AI assistant for Microsoft Excel. Your job is to translate user voice commands into JSON actions.
Return a JSON OBJECT with a key "actions" containing an ARRAY of action objects.
Do NOT return markdown. Return ONLY raw JSON.

Supported Actions:
1. **editCell** (address, values, isFormula)
2. **formatRange** (address, format: {fill, fontColor, bold, italic, fontSize, numberFormat, horizontalAlignment})
3. **createTable** (address, hasHeaders, name)
4. **createChart** (dataRange, type, title, seriesBy)
5. **addWorksheet** (name)
6. **freezePanes** (type, count)
`;

        const parts = [
            { text: `${ACTION_SCHEMA}\n\nContext: ${context || "No context provided"}\nUser Voice Command (Audio Provided)\n\nJSON Response:` },
            {
                inlineData: {
                    mimeType: req.file.mimetype || 'audio/webm',
                    data: audioBase64
                }
            }
        ];

        const result = await model.generateContent({
            contents: [{ role: "user", parts: parts }]
        });

        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsed = JSON.parse(cleanJson);
            // Add a "transcript" field if Gemini doesn't provide it explicitly, 
            // though we are asking for actions. We might want to ask for transcript too but let's stick to actions for now.
            // Ideally we'd ask for: { transcript: "string", actions: [] }
            res.json({ ...parsed, _raw: responseText });
        } catch (e) {
            console.error("Failed to parse JSON from voice:", responseText);
            res.status(500).json({ error: "Failed to parse AI response", raw: responseText });
        }

    } catch (error) {
        console.error("Voice Processing Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
