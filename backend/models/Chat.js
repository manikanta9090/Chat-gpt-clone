const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [{
        role: String,
        text: String,
    }],
    shareId: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Virtual field to convert _id to string id for frontend compatibility
chatSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtuals are included in JSON output
chatSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model("Chat", chatSchema);