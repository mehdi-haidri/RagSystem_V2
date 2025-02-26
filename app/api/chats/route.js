import { DbConnection } from '@/db/DbConnection.js';
import Chat from '@/models/Chat.js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { user_id  , label} = await req.json();
    if (!user_id) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    await DbConnection();
    console.log("User ID:", user_id);

    const newChat = new Chat({ user_id , label});
    const savedChat = await newChat.save();

    return Response.json({
      id: savedChat._id,
      created_at: savedChat.created_at,
    }, { status: 201 });

  } catch (error) {
    console.error("Chat creation error:", error);
    return Response.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}

// Adjust the import based on your project structure
export async function PUT(req) {
  try {
    // Parse the request body
    const body = await req.json();

    // Validate the request body
    if (!body.chat_id || !body.label) {
      return Response.json({ error: 'Missing required fields: id or lastmessage' }, { status: 400 });
    }

    // Connect to the database
    await DbConnection();

    // Update the chat label
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: body.chat_id }, // Filter by chat ID
      { label: body.label }, // Update the label field
      { new: true } // Return the updated document
    );

    // Check if the chat was found and updated
    if (!updatedChat) {
      return Response.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Return the updated chat
    return Response.json({ message: 'Chat updated successfully', chat: updatedChat }, { status: 200 });
  } catch (error) {
    console.error('Chat update error:', error);
    return Response.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Get `user_id` from query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return Response.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Connect to DB
    await DbConnection();

    // Fetch chats for the given user
    const chats = await Chat.find({ user_id: userId }).sort({ created_at: -1 }); // Latest first

    return Response.json({ chats }, { status: 200 });

  } catch (error) {
    console.error("Error fetching chats:", error);
    return Response.json({ error: 'Failed to fetch chats', details: error.message }, { status: 500 });
  }
}
