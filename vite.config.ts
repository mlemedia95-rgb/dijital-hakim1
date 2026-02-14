
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  define: {
    // Vercel'deki Environment Variable'ı doğrudan koda enjekte eder
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  }
});
