import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': 'http://localhost:3001'
        }
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.BASE_URL': JSON.stringify('https://jiqskbqtcouyxytpzmoh.supabase.co'),
        'process.env.USE_MOCKS': JSON.stringify(env.USE_MOCKS || 'false')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
