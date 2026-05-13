const OpenAI = require('openai');

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

/**
 * Send a message to OpenRouter and get a response
 * @param {string} message - The user's message
 * @param {Array} messagesHistory - Optional array of previous messages
 * @returns {Promise<string>} - The AI's response text
 */
exports.sendMessage = async (message, messagesHistory = []) => {
  try {
    // Build messages array with conversation history
    const messages = [];

    // Limit conversation history to last 8 messages as specified
    const recentHistory = messagesHistory.slice(-8);

    // Add conversation history
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      });
    }

    // Add current message
    messages.push({
      role: "user",
      content: message,
    });

    console.log("Using OpenRouter");

    const response = await openrouter.chat.completions.create({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      messages: messages,
      max_tokens: 4096,
      temperature: 0.7,
    });

    const reply = response.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("No response from OpenRouter");
    }

    return reply;
  } catch (error) {
    console.error("OpenRouter API error:", error.message);
    throw error;
  }
};