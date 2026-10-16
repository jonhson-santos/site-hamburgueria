import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optimized configuration for Vercel Deployment
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 5175,
  }
})
