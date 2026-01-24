import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import copilotPlugin from './vite-plugin-copilot'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copilotPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@app': path.resolve(__dirname, './src/app'),
      '@marketing': path.resolve(__dirname, './src/marketing'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
