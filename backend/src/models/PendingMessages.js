const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.Mixed, required: true },
  to: { type: mongoose.Schema.Types.Mixed, required: true },
  time: { type: Date, default: Date.now },
  message: { type: mongoose.Schema.Types.Mixed, required: true }
});

const pendingMessagesSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  messages: [messageSchema]
});

module.exports = mongoose.model('PendingMessages', pendingMessagesSchema);
