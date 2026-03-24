import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    host: '127.0.0.1',
  },
  build: {
    outDir: 'dist'
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
