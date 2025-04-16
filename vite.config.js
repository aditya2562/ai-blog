import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api-proxy': {
          target: isProduction 
            ? 'https://ai-blog-backend-z7bp.onrender.com' 
            : 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, '/generate')
        }
      }
    }
  }
})