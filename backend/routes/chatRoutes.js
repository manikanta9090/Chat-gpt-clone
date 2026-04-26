const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// GET all chats
router.get("/", chatController.getAllChats);

// GET single chat by ID
router.get("/:id", chatController.getChat);

// POST create new chat
router.post("/", chatController.createChat);

// PUT add message to chat
router.put("/:id/message", chatController.updateChat);

// PATCH update chat title
router.patch("/:id/title", chatController.updateChatTitle);

// DELETE chat
router.delete("/:id", chatController.deleteChat);

module.exports = router;
