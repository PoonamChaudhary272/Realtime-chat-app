import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { socket } from './services/socket';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import { useToastStore } from './store/toastStore';

const App: React.FC = () => {
  const { isAuthenticated, user, initialize } = useAuthStore();
  const { toasts, removeToast } = useToastStore();

  // Initialize auth headers
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  React.useEffect(() => {
    // Connect socket when user is authenticated
    if (isAuthenticated && user) {
      socket.connect();
      socket.emit('user:online', { userId: user._id });
      
      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast messages */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
          {toasts.map((toast) => (
            <Toast 
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </Router>
  );
};

export default App;