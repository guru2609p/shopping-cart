import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Fixes the EBUSY error by ignoring temp files
      ignored: ['**/*.TMP', '**/*~*'], 
    },
    // Optimizes network speeds for local Windows environments
    host: 'localhost',
  },
})