import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { socket } from '../services/socket';
import { useToastStore } from '../store/toastStore';

// Components
import ChatHeader from '../components/chat/ChatHeader';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import RoomsList from '../components/chat/RoomsList';
import UserList from '../components/chat/UserList';
import CreateRoomModal from '../components/chat/CreateRoomModal';

const Chat: React.FC = () => {
  const { user, logout } = useAuthStore();
  const {
    messages,
    rooms,
    activeRoom,
    onlineUsers,
    fetchRooms,
    fetchMessages,
    sendMessage,
    updateOnlineUsers,
    addMessage,
    markMessagesAsRead,
  } = useChatStore();
  const { addToast } = useToastStore();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showUserList, setShowUserList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  // Timer for typing indicator
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial data fetch
    fetchRooms();

    // Socket event listeners
    socket.on('user:list', (users) => {
      updateOnlineUsers(users);
    });

    socket.on('message:new', (message) => {
      if (message.room === activeRoom?._id) {
        addMessage(message);
        
        // Mark messages as read if this is the current user
        if (user) {
          markMessagesAsRead(message.room, user._id);
        }
      } else {
        // Show notification for messages in other rooms
        addToast(`New message in ${rooms.find(r => r._id === message.room)?.name || 'another room'}`, 'info');
      }
    });

    socket.on('user:typing', ({ roomId, username }) => {
      if (roomId === activeRoom?._id) {
        setIsTyping(true);
        setTypingUser(username);
        
        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set timeout to clear typing indicator
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTypingUser('');
        }, 3000);
      }
    });

    return () => {
      // Cleanup socket listeners
      socket.off('user:list');
      socket.off('message:new');
      socket.off('user:typing');
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeRoom, fetchRooms, addMessage, updateOnlineUsers, rooms, user, markMessagesAsRead, addToast]);

  const handleSendMessage = (content: string) => {
    if (activeRoom && user) {
      sendMessage(content, activeRoom._id, user._id);
    }
  };

  const handleTyping = () => {
    if (activeRoom && user) {
      socket.emit('user:typing', { roomId: activeRoom._id, username: user.username });
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleUserList = () => {
    setShowUserList(!showUserList);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Rooms/Channels Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-surface border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-text-primary">Rooms</h2>
          <button 
            onClick={() => setShowCreateRoomModal(true)}
            className="mt-2 btn btn-primary text-sm py-1 w-full"
          >
            New Room
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <RoomsList rooms={rooms} activeRoom={activeRoom} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader 
          roomName={activeRoom?.name || 'Select a room'} 
          toggleSidebar={toggleSidebar}
          toggleUserList={toggleUserList}
          onLogout={logout}
          username={user?.username || ''}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {activeRoom ? (
                <MessageList 
                  messages={messages} 
                  currentUserId={user?._id || ''} 
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-text-secondary">Select a room to start chatting</p>
                </div>
              )}
              {isTyping && (
                <div className="text-sm text-text-secondary italic ml-2 mb-2">
                  {typingUser} is typing...
                </div>
              )}
            </div>
            
            {activeRoom && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <MessageInput 
                  onSendMessage={handleSendMessage} 
                  onTyping={handleTyping}
                  disabled={!activeRoom}
                />
              </div>
            )}
          </div>
          
          {/* Online Users */}
          <div className={`${showUserList ? 'w-64' : 'w-0'} bg-surface border-l border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-text-primary">Online Users</h2>
            </div>
            <div className="p-2">
              <UserList 
                onlineUsers={onlineUsers} 
                currentUserId={user?._id || ''} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoomModal && (
        <CreateRoomModal 
          onClose={() => setShowCreateRoomModal(false)} 
        />
      )}
    </div>
  );
};

export default Chat;