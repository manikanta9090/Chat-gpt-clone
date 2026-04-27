require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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

// API routes
app.use("/api/chats", chatRoutes);
app.use("/api", shareRoutes);

// Gemini chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await getAIResponse(message);
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
