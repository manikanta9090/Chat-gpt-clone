const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareController");

// GET share link for a chat
router.get("/get-share-link/:id", shareController.getShareLink);

// GET shared chat by shareId
router.get("/share/:shareId", shareController.getSharedChat);

module.exports = router;
