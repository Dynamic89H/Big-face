import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev proxy forwards API + realtime traffic to the Big Face backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  preview: {
    port: 5173,
  },
});
