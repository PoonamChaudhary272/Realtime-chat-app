import React from 'react';
import { Room } from '../../store/chatStore';

interface ChatSidebarProps {
  rooms: Room[];
  activeRoom: Room | null;
  onRoomSelect: (room: Room) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ rooms, activeRoom, onRoomSelect }) => {
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-text-primary">Channels</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {rooms.map((room) => (
            <li key={room._id}>
              <button
                onClick={() => onRoomSelect(room)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeRoom?._id === room._id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                # {room.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;