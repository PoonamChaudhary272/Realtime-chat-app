import React from 'react';
import { Menu, Users, LogOut } from 'lucide-react';

interface ChatHeaderProps {
  roomName: string;
  username: string;
  toggleSidebar: () => void;
  toggleUserList: () => void;
  onLogout: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  roomName,
  username,
  toggleSidebar,
  toggleUserList,
  onLogout,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-xl font-semibold text-text-primary truncate">{roomName}</h2>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-text-secondary text-sm mr-2">
          Logged in as <span className="font-semibold">{username}</span>
        </div>
        <button
          onClick={toggleUserList}
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle user list"
        >
          <Users size={20} />
        </button>
        <button
          onClick={onLogout}
          className="p-2 rounded-md text-text-secondary hover:text-error hover:bg-error/10 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;