import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,   // default Vite port
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // your backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
