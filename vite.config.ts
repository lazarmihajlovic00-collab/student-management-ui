import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /*server: {
    // Proxy konfiguracija — prosleđuje API pozive ka backendu
    proxy: {
      // Sve rute koje počinju sa /auth → prosledi na localhost:8080
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Sve rute koje počinju sa /api → prosledi na localhost:8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },*/
})