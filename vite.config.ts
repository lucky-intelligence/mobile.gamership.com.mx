import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxImportSource: 'preact',
  },
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
})
