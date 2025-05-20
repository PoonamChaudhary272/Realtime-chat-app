import React, { useEffect, useRef } from 'react';
import { Message } from '../../store/chatStore';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group messages by sender and time
  const groupedMessages: Message[][] = [];
  
  messages.forEach((message, index) => {
    const prevMessage = messages[index - 1];
    
    // Start a new group if:
    // 1. This is the first message
    // 2. The sender changed
    // 3. More than 5 minutes passed since the last message
    if (
      index === 0 ||
      prevMessage.sender._id !== message.sender._id ||
      new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000
    ) {
      groupedMessages.push([message]);
    } else {
      // Add to the last group
      groupedMessages[groupedMessages.length - 1].push(message);
    }
  });

  return (
    <div className="space-y-6">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-1">
          {group.map((message, messageIndex) => (
            <MessageItem
              key={message._id}
              message={message}
              isOwn={message.sender._id === currentUserId}
              showSender={messageIndex === 0}
            />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;