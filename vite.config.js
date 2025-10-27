// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ✅ Firebase modules ko ensure karo ke bundle me aayein
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
    ],
  },

  // ✅ Build settings for Vercel
  build: {
    outDir: 'dist', // Vercel expects build output here
    rollupOptions: {},
    chunkSizeWarningLimit: 1000, // just to avoid build size warnings
  },

  // ✅ Important: Fix routing issue (base path)
  base: './', // Use relative paths to ensure routes work on Vercel

  // ✅ Experimental Rollup fix (for Mac + Vite)
  experimental: {
    useRollup: true,
  },

  // ✅ Resolve alias (optional but helps imports stay clean)
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})