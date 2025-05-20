import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="bg-primary text-white p-4 rounded-full mb-6">
        <MessageSquare size={48} />
      </div>
      <h1 className="text-4xl font-bold text-text-primary mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;