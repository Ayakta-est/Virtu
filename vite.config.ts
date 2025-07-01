import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
const config: UserConfig = defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});

export default config;
