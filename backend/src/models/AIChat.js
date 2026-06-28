const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const aiChatSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true, // One chat history per project
      index: true
    },
    messages: [messageSchema]
  },
  {
    timestamps: true
  }
);

const AIChat = mongoose.model('AIChat', aiChatSchema);
module.exports = AIChat;
