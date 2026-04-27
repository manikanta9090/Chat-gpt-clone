const Chat = require("../models/Chat");
const { v4: uuidv4 } = require("uuid");

// Generate share link for a chat
exports.getShareLink = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Generate shareId if it doesn't exist
    if (!chat.shareId) {
      chat.shareId = uuidv4();
      await chat.save();
    }

    res.json({ shareId: chat.shareId });
  } catch (error) {
    console.error("Error generating share link:", error);
    res.status(500).json({ error: "Failed to generate share link" });
  }
};

// Fetch shared chat by shareId
exports.getSharedChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ shareId: req.params.shareId });

    if (!chat) {
      return res.status(404).json({ error: "Shared chat not found" });
    }

    // Return chat without shareId (optional)
    const { shareId, ...chatData } = chat.toObject();
    res.json(chatData);
  } catch (error) {
    console.error("Error fetching shared chat:", error);
    res.status(500).json({ error: "Failed to fetch shared chat" });
  }
};
