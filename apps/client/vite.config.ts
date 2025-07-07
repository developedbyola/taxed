import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import unFonts from 'unplugin-fonts/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    unFonts({
      google: {
        display: 'swap',
        preconnect: true,
        injectTo: 'head-prepend',
        preconnectUrl: 'https://fonts.gstatic.com',
        fontBaseUrl: 'https://fonts.googleapis.com/css2',
        families: [
          {
            name: 'Inter',
            styles: 'wght@400;500;600;700',
            defer: true,
          },
        ],
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
