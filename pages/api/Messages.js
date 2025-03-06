import { DbConnection } from '@/db/DbConnection.js';
import Message from '@/models/Message';
import Chat from '@/models/Chat';

// Handle POST request (Create a new message)
export async function POST(req) {
  try {
    await DbConnection();
    
    const { message, role, chat_id } = await req.json(); // Get request body

    // Verify if the chat exists
    const chatExists = await Chat.exists({ _id: chat_id });
    if (!chatExists) {
      return Response.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Create and save new message
    const newMessage = new Message({ message, role, chat_id });
    const savedMessage = await newMessage.save();

    return Response.json({
      id: savedMessage._id.toString(),
      message: savedMessage.message,
      role: savedMessage.role,
      chat_id: savedMessage.chat_id.toString(),
      created_at: savedMessage.created_at,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating message:", error);
    return Response.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

// Handle GET request (Fetch messages by chat_id)
export async function GET(req) {
  try {
    await DbConnection();
    
    // Extract query params
    const { searchParams } = new URL(req.url);
    const chat_id = searchParams.get('chat_id');

    if (!chat_id) {
      return Response.json({ error: 'chat_id is required' }, { status: 400 });
    }

    // Fetch messages for the given chat
    const messages = await Message.find({ chat_id }).sort({ created_at: 1 }).lean();

    return Response.json(messages.map(msg => ({
      id: msg._id.toString(),
      message: msg.message,
      role: msg.role,
      chat_id: msg.chat_id.toString(),
      created_at: msg.created_at,
    })), { status: 200 });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
