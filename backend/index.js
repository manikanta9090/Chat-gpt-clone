require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const chatRoutes = require("./routes/chatRoutes");
const shareRoutes = require("./routes/shareRoutes");
const { sendMessage: getAIResponse } = require("./controllers/geminiService");

const app = express();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-chat";

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

// Gemini chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message, messages } = req.body;

    // Support both old format (single message) and new format (full conversation)
    if (!message && !messages) {
      return res.status(400).json({ error: "Message or messages array is required" });
    }

    let reply;
    if (messages && Array.isArray(messages)) {
      // New format: full conversation context
      const currentMessage = messages[messages.length - 1]?.text;
      const conversationHistory = messages.slice(0, -1); // All messages except the last one

      reply = await getAIResponse(currentMessage, conversationHistory);
    } else {
      // Old format: single message (for backward compatibility)
      reply = await getAIResponse(message);
    }

    res.json({ reply });
  } catch (error) {
    console.error("ERROR:", error.message);
    // Fallback response for quota errors or API failures
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
