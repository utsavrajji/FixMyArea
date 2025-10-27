// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // ✅ Ensure Firebase is bundled
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
    ],
  },
  
  // ✅ Do not mark Firebase as external
  build: {
    rollupOptions: {},
  },

  // ✅ Optional (fixes Mac build)
  experimental: {
    useRollup: true,
  },
})