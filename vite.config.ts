import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
  ],
  build: {
    outDir: '../build' // replaces CRA's BUILD_PATH
  },
  server: {
    port: 3000,
    proxy: {
      'public/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    },
  },
  preview: {
    port: 3000
  },
  resolve:{
    alias: {
      "@":path.resolve(__dirname, "./src"),
      "public":path.resolve(__dirname, "./public")
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd'], // Add your deps here
  },
  // // ===== NEW VITEST CONFIGURATION =====
  // test: {
  //   globals: true,            // Use Vitest global APIs (like describe, it, expect)
  //   environment: 'jsdom',     // Simulate browser environment
  //   setupFiles: 'setupTests.ts', // Optional setup file
  //   coverage: {
  //     provider: 'v8',         // or 'istanbul'
  //     reporter: ['text', 'json', 'html'], // Generate coverage reports
  //     include: ['src/**/*.{ts,tsx}'],     // Which files to cover
  //     exclude: ['**/*.stories.{ts,tsx}'], // Exclude Storybook files from coverage
  //   },
  //   // Optional: Test file patterns
  //   include: ['src/**/*.{test,spec}.{ts,tsx}'],
  //   // Optional: Increase timeout for slow tests
  //   testTimeout: 15000,
  //   // Optional: Support for MSW (Mock Service Worker)
  //   deps: {
  //     inline: ['msw'],
  //   },
  // }
})
