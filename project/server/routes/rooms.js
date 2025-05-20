import express from 'express';
import Room from '../models/Room.js';
import Message from '../models/Message.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all rooms
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    
    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new room
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if room with same name exists
    const existingRoom = await Room.findOne({ name });
    
    if (existingRoom) {
      return res.status(400).json({ message: 'Room with that name already exists' });
    }
    
    // Create new room
    const room = new Room({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    
    await room.save();
    
    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single room
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('members', 'username email');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a room
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is the creator of the room
    if (room.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this room' });
    }
    
    // Update room
    if (name) room.name = name;
    if (description !== undefined) room.description = description;
    if (isPrivate !== undefined) room.isPrivate = isPrivate;
    
    await room.save();
    
    res.json(room);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a room
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is the creator of the room
    if (room.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }
    
    // Delete all messages in the room
    await Message.deleteMany({ room: req.params.id });
    
    // Delete the room
    await room.remove();
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a room
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is already a member
    if (room.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member of this room' });
    }
    
    // Add user to members
    room.members.push(req.user.id);
    await room.save();
    
    res.json({ message: 'Joined room successfully', room });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a room
router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is a member
    if (!room.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Not a member of this room' });
    }
    
    // Remove user from members
    room.members = room.members.filter(
      (memberId) => memberId.toString() !== req.user.id
    );
    
    await room.save();
    
    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;