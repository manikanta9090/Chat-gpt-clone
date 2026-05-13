const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Send a message to Gemini and get a response
 * @param {string} message - The user's message
 * @param {Array} messagesHistory - Optional array of previous messages
 * @returns {Promise<string>} - The AI's response text
 */
exports.sendMessage = async (message, messagesHistory = []) => {
  try {
    // Build contents array with conversation history
    const contents = [];

    // Limit conversation history to last 20 messages to avoid API limits
    const recentHistory = messagesHistory.slice(-20);

    // Add conversation history (excluding the current message which is passed separately)
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === "user" ? "user" : (msg.role === "ai" || msg.role === "assistant" ? "model" : "user"),
        parts: [{ text: msg.text }],
      });
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    console.log("Sending to Gemini with", contents.length, "messages in context");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        maxOutputTokens: 8192,
        temperature: 0.7,
        topP: 0.8,
        topK: 10,
      },
    });

    // Extract ALL text parts from the response and combine them
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      return "⚠️ No response from AI";
    }

    // Combine all text parts into one complete response
    const reply = candidate.content.parts
      .map(part => part.text || "")
      .join("")
      .trim();

    // Log response details for debugging
    console.log("Gemini Response Debug:");
    console.log("- Full response candidates:", response.candidates?.length);
    console.log("- Content parts count:", candidate.content.parts.length);
    console.log("- Response text length:", reply.length);
    console.log("- Response preview:", reply.substring(0, 200) + (reply.length > 200 ? "..." : ""));

    return reply;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw error;
  }
};
