// models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(), // Auto-generate if not provided
  },
  message: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'system'],
    required: true,
  },
  chat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);