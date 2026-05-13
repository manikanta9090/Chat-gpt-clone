require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const chatRoutes = require("./routes/chatRoutes");
const shareRoutes = require("./routes/shareRoutes");
const geminiService = require("./services/geminiService");
const groqService = require("./services/groqService");
const openrouterService = require("./services/openrouterService");

const app = express();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status'));

// API routes
app.use("/api/chats", chatRoutes);
app.use("/api", shareRoutes);

// Multi-provider AI chat endpoint with fallback
app.post("/chat", async(req, res) => {
    try {
        const { message, messages } = req.body;

        // Support both old format (single message) and new format (full conversation)
        if (!message && !messages) {
            return res.status(400).json({ error: "Message or messages array is required" });
        }

        let currentMessage, conversationHistory;

        if (messages && Array.isArray(messages)) {
            // New format: full conversation context
            currentMessage = messages[messages.length - 1] ? messages[messages.length - 1].text : "";
            conversationHistory = messages.slice(0, -1); // All messages except the last one
        } else {
            // Old format: single message (for backward compatibility)
            currentMessage = message;
            conversationHistory = [];
        }

        // Limit context to last 8 messages as specified
        const limitedHistory = conversationHistory.slice(-8);

        let reply;

        // Try Gemini first (primary)
        try {
            console.log("Using Gemini");
            reply = await geminiService.sendMessage(currentMessage, limitedHistory);
        } catch (geminiError) {
            console.log("Gemini failed, switching to Groq");
            try {
                // Try Groq (fallback)
                reply = await groqService.sendMessage(currentMessage, limitedHistory);
            } catch (groqError) {
                console.log("Groq failed, switching to OpenRouter");
                try {
                    // Try OpenRouter (backup)
                    reply = await openrouterService.sendMessage(currentMessage, limitedHistory);
                } catch (openrouterError) {
                    console.error("All AI providers failed:", { gemini: geminiError.message, groq: groqError.message, openrouter: openrouterError.message });
                    return res.json({ reply: "⚠️ All AI services are currently unavailable, please try again later" });
                }
            }
        }

        res.json({ reply });
    } catch (error) {
        console.error("ERROR:", error.message);
        // Fallback response for unexpected errors
        res.json({ reply: "⚠️ AI unavailable, try later" });
    }
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});