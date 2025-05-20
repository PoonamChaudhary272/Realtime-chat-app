import React, { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useToastStore } from '../../store/toastStore';
import { X } from 'lucide-react';

interface CreateRoomModalProps {
  onClose: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose }) => {
  const [roomName, setRoomName] = useState('');
  const { createRoom, isLoading } = useChatStore();
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      addToast('Room name cannot be empty', 'error');
      return;
    }
    
    try {
      await createRoom(roomName.trim());
      addToast('Room created successfully', 'success');
      onClose();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-text-primary">Create New Room</h3>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="roomName" className="block text-sm font-medium text-text-primary mb-1">
              Room Name
            </label>
            <input
              id="roomName"
              type="text"
              className="input"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="general"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-text-primary hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;