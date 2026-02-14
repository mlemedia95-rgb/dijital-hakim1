
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  // Bu kısım process.env.API_KEY hatasını çözer
  define: {
    'process.env': {}
  }
});
