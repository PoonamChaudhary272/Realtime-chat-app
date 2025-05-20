import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping: () => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onTyping,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastTypingTime = useRef<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    
    // Handle typing indicator - throttle to every 3 seconds
    const now = Date.now();
    if (now - lastTypingTime.current > 3000) {
      onTyping();
      lastTypingTime.current = now;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end">
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Select a room to start chatting" : "Type a message..."}
        className="input resize-none max-h-32 min-h-[2.5rem]"
        disabled={disabled}
        rows={1}
      />
      <button
        type="submit"
        className={`ml-2 p-2 rounded-full ${
          message.trim() && !disabled
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        } transition-colors`}
        disabled={!message.trim() || disabled}
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default MessageInput;