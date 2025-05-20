import React from 'react';
import { Message } from '../../store/chatStore';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showSender: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn, showSender }) => {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
      {showSender && !isOwn && (
        <div className="ml-2 mb-1">
          <span className="text-sm font-medium text-text-primary">{message.sender.username}</span>
        </div>
      )}
      
      <div className={`message-bubble ${isOwn ? 'message-bubble-own' : 'message-bubble-other'}`}>
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className={`text-xs mt-1 ${isOwn ? 'text-right' : 'text-left'} text-text-secondary`}>
          {formatDistanceToNow(new Date(message.createdAt))}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;