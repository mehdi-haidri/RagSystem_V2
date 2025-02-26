// models/Chat.js
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  label: {
    type: String,
    default: Date.now,
  },
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);