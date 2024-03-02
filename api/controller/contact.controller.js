import Message from "../models/contactUs.model.js";
import { io } from "../index.js";

export const sendMessage = async (req, res) => {
  try {
    // Extract form data from the request body
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new message object
    const newMessage = new Message({ email, subject, message });

    // Save the message to the database
    await newMessage.save();

    // Emit the new message to all connected users
    io.emit('newMessage', { email, subject, message});

    // Respond with success status
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    // Respond with error status if something goes wrong
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const fetchMessages = async (req, res) => {
  try {
    // Fetch all messages from the database
    const messages = await Message.find().sort({ createdAt: -1});

    // Respond with the messages
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Example controller function to fetch unread messages for the logged-in admin
export const fetchUnreadMessages = async (req, res) => {
  try {
    const adminId = req.user.id; // Assuming you have authenticated the admin user and stored their ID in req.user
    const unreadMessages = await Message.find({ adminId: adminId, isRead: false });
    res.json(unreadMessages);
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

