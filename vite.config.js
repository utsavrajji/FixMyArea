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
    outDir: 'dist', // ✅ Vercel expects build output here
    rollupOptions: {},
  },

  base: '/', // ✅ Ensures proper routing on Vercel

  experimental: {
    useRollup: true,
  },
})