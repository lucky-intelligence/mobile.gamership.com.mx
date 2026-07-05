import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  esbuild: {
    jsxImportSource: 'preact',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  server: {
    port: 4173,
    headers: {
      'strict-transport-security': 'max-age=63072000; includeSubDomains;',
    },
    allowedHosts: true,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'User-Agent'],
      credentials: true,
    }
  },
  preview: {
    port: 4173,
    allowedHosts: true,
    headers: {
      'strict-transport-security': 'max-age=63072000; includeSubDomains;',
    }
  }
})
