import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/upload': 'http://localhost:8000',
      '/analyze': 'http://localhost:8000',
      '/predict': 'http://localhost:8000',
      '/priority': 'http://localhost:8000',
      '/issues': 'http://localhost:8000',
      '/uploads': 'http://localhost:8000'
    }
  }
});
