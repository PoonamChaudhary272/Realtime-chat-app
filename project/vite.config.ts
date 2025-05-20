import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5174,
    host: true, // This makes the server accessible from other devices on the network
    strictPort: true, // This will fail if port 5174 is not available
  },
});
