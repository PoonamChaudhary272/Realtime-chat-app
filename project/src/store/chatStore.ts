import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';
import { socket } from '../services/socket';
import { User } from './authStore';

export interface Message {
  _id: string;
  sender: User;
  room: string;
  content: string;
  createdAt: string;
  readBy: string[];
}

export interface Room {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  messages: Message[];
  rooms: Room[];
  onlineUsers: { _id: string; username: string }[];
  activeRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  
  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (content: string, roomId: string, senderId: string) => Promise<void>;
  createRoom: (name: string) => Promise<void>;
  setActiveRoom: (room: Room) => void;
  updateOnlineUsers: (users: { _id: string; username: string }[]) => void;
  addMessage: (message: Message) => void;
  markMessagesAsRead: (roomId: string, userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  rooms: [],
  onlineUsers: [],
  activeRoom: null,
  isLoading: false,
  error: null,
  
  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/rooms`);
      set({ rooms: response.data, isLoading: false });
      
      // Set first room as active if none is selected
      if (!get().activeRoom && response.data.length > 0) {
        set({ activeRoom: response.data[0] });
        get().fetchMessages(response.data[0]._id);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch rooms',
        isLoading: false,
      });
    }
  },
  
  fetchMessages: async (roomId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/messages/${roomId}`);
      set({ messages: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch messages',
        isLoading: false,
      });
    }
  },
  
  sendMessage: async (content, roomId, senderId) => {
    try {
      socket.emit('message:send', { content, roomId, senderId });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to send message',
      });
    }
  },
  
  // createRoom: async (name) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await axios.post(`${API_URL}/api/rooms`, { name });
  //     set((state) => ({
  //       rooms: [...state.rooms, response.data],
  //       isLoading: false,
  //     }));
  //   } catch (error: any) {
  //     set({
  //       error: error.response?.data?.message || 'Failed to create room',
  //       isLoading: false,
  //     });
  //   }
  // },
  

  createRoom: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/rooms`, { name });
      const newRoom = response.data;
  
      set((state) => ({
        rooms: [...state.rooms, newRoom],
        activeRoom: newRoom, // optional: automatically switch to the new room
        isLoading: false,
      }));
  
      // Optionally fetch messages for the new room
      get().fetchMessages(newRoom._id);
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create room", isLoading: false });
    }
  },
  setActiveRoom: (room) => {
    set({ activeRoom: room });
    get().fetchMessages(room._id);
  },
  

  updateOnlineUsers: (users) => {
    set({ onlineUsers: users });
  },
  
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  
  markMessagesAsRead: async (roomId, userId) => {
    try {
      await axios.post(`${API_URL}/api/messages/read`, { roomId, userId });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to mark messages as read',
      });
    }
  },
}));