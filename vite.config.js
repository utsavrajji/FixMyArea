// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
    ],
  },

  build: {
    outDir: 'dist',
    rollupOptions: {},
  },

  // ✅ FIX: Vercel ke liye '/' use karo
  base: '/',

  server: {
    port: 3000,
    open: true,
  },
})
