import express from 'express';
import Message from '../models/Message.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get messages for a room
router.get('/:roomId', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    // Calculate skip for pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('sender', 'username email')
      .lean();
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, roomId } = req.body;
    
    const message = new Message({
      content,
      sender: req.user.id,
      room: roomId,
      readBy: [req.user.id], // Mark as read by sender
    });
    
    await message.save();
    
    // Populate sender info for response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username email')
      .lean();
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.post('/read', authMiddleware, async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    
    // Find all unread messages in the room
    const unreadMessages = await Message.find({
      room: roomId,
      readBy: { $ne: userId },
    });
    
    // Update all messages to add user to readBy array
    await Promise.all(
      unreadMessages.map((message) => {
        message.readBy.push(userId);
        return message.save();
      })
    );
    
    res.json({ message: 'Messages marked as read', count: unreadMessages.length });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a message
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await message.remove();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;