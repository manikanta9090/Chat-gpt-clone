require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post("/chat", async(req, res) => {
    try {
        const { message } = req.body;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // stable model
            contents: message,
        });

        res.json({
            reply: response.text,
        });
    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).send("Error generating response");
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});