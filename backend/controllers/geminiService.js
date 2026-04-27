const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

/**
 * Send a message to Gemini and get a response
 * @param {string} message - The user's message
 * @param {Array} messagesHistory - Optional array of previous messages in app format
 * @returns {Promise<string>} - The AI's response text
 */
exports.sendMessage = async (message, messagesHistory = []) => {
  try {
    // Convert history to Gemini format
    const contents = messagesHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw error;
  }
};
