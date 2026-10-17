import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev proxy forwards API + realtime traffic to the Big Face backend.
export default defineConfig({
  plugins: [react()],
  build: {
    // Split vendor chunks for better caching + parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-socket': ['socket.io-client'],
          // three.js and stripe load only in their lazy chunks (studio/wallet)
        },
      },
    },
    // Target modern browsers for smaller output
    target: 'es2020',
    // Minify with esbuild (default, fast)
    minify: 'esbuild',
  },
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
