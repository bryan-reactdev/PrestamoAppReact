import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(
      {
        babel: {
          // plugins: [["babel-plugin-react-compiler"]],
        },
      },
    ),
  ],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          router: ['react-router-dom'],
          utils: ['axios', 'zustand']
        }
      }
    }
  },
  preview: {
    port: 4173,
    host: true
  }
})