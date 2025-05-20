import React from 'react';
import { User } from '../../store/authStore';
import { useAuthStore } from '../../store/authStore';
import { Circle } from 'lucide-react';

interface UserListProps {
  onlineUsers: { _id: string; username: string }[];
  currentUserId: string;
}

const UserList: React.FC<UserListProps> = ({ onlineUsers, currentUserId }) => {
  const { user } = useAuthStore();

  return (
    <ul className="space-y-2">
      {onlineUsers.length === 0 ? (
        <li className="text-text-secondary text-center py-4">No users online</li>
      ) : (
        onlineUsers.map((u) => {
          const isCurrentUser = u._id === currentUserId;
          return (
            <li key={u._id} className="flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <div className="relative">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-text-primary">
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <Circle size={10} className="absolute bottom-0 right-0 text-success fill-success" />
              </div>
              <span className="ml-2 text-text-primary font-medium">
                {u.username}
                {isCurrentUser && ' (you)'}
              </span>
            </li>
          );
        })
      )}
    </ul>
  );
};

export default UserList;