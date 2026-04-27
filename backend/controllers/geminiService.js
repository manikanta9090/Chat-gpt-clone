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

    // Add history
    for (const msg of messagesHistory) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Extract text safely with optional chaining
    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from AI";

    return reply;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw error;
  }
};
