
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  define: {
    // Vercel ortamındaki API_KEY'i kodun içine enjekte eder
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': {}
  }
});
