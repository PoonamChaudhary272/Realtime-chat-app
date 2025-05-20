import React from 'react';
import { Room } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { Hash } from 'lucide-react';

interface RoomsListProps {
  rooms: Room[];
  activeRoom: Room | null;
}

const RoomsList: React.FC<RoomsListProps> = ({ rooms, activeRoom }) => {
  const { setActiveRoom } = useChatStore();

  const handleRoomSelect = (room: Room) => {
    setActiveRoom(room);
  };

  return (
    <ul className="space-y-1">
      {rooms.length === 0 ? (
        <li className="text-text-secondary text-sm p-2">No rooms available</li>
      ) : (
        rooms.map((room) => (
          <li key={room._id}>
            <button
              onClick={() => handleRoomSelect(room)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
                activeRoom?._id === room._id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Hash size={18} className="mr-2 opacity-70" />
              <span className="truncate">{room.name}</span>
            </button>
          </li>
        ))
      )}
    </ul>
  );
};

export default RoomsList;