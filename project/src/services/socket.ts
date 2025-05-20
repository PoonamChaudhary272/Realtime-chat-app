import { io } from 'socket.io-client';
import { API_URL } from '../config';

// Create socket instance
export const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

// Event listeners for debugging
socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
  if (reason === 'io server disconnect') {
    // the disconnection was initiated by the server, you need to reconnect manually
    socket.connect();
  }
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Function to manually connect socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Function to manually disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};