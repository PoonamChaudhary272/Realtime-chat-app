import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);
// Import routes
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import messageRoutes from './routes/messages.js';

// Import models
import User from './models/User.js';
import Message from './models/Message.js';

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io connection
const onlineUsers = new Map();

// Helper function to emit online users with usernames
async function emitOnlineUsers(io, onlineUsers) {
  const userIds = Array.from(new Set(onlineUsers.values()));
  if (userIds.length === 0) {
    io.emit('user:list', []);
    return;
  }
  const users = await User.find({ _id: { $in: userIds } }).select('username _id');
  io.emit('user:list', users);
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Handle connection errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // User comes online
  socket.on('user:online', async ({ userId }) => {
    if (userId) {
      onlineUsers.set(socket.id, userId);
      await emitOnlineUsers(io, onlineUsers);
    }
  });
  
  // User joins a room
  socket.on('room:join', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });
  
  // User sends a message
  socket.on('message:send', async ({ content, roomId, senderId }) => {
    try {
      // Create new message in database
      const message = new Message({
        content,
        sender: senderId,
        room: roomId,
      });
      
      const savedMessage = await message.save();
      
      // Populate sender info
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate('sender', 'username email')
        .lean();
      
      // Broadcast to everyone in the room
      io.to(roomId).emit('message:new', populatedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // User is typing
  socket.on('user:typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user:typing', { roomId, username });
  });
  
  // User disconnects
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    onlineUsers.delete(socket.id);
    await emitOnlineUsers(io, onlineUsers);
  });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-chat';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

export default server;