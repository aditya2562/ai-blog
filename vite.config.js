import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  const backendBase = isProduction
    ? 'https://ai-blog-backend-z7bp.onrender.com'
    : 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy for generating blog
        '/api-proxy': {
          target: backendBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, '/generate')
        },
        // Proxy for sending email
        '/send-email-proxy': {
          target: backendBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/send-email-proxy/, '/send_email')
        }
      }
    }
  }
})