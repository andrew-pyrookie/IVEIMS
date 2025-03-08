import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change to your desired port
  },
  base: '/', // Relative to index.html
  build: {
    chunkSizeWarningLimit: 2000, // Optional: Suppresses large chunk warning
  },
})
