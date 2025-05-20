import React, { useEffect, useState } from 'react';
import { ToastType } from '../store/toastStore';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation timing
    setTimeout(() => setIsVisible(true), 10);
    return () => setIsVisible(false);
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success" size={20} />;
      case 'error':
        return <AlertCircle className="text-error" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-warning" size={20} />;
      case 'info':
      default:
        return <Info className="text-primary" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'info':
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <div
      className={`${getBgColor()} border rounded-lg shadow-md p-4 flex items-start max-w-md transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex-shrink-0 mr-3">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-text-primary">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-text-secondary hover:text-text-primary transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;