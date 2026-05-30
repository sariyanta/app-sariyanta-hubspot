import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src/theme/sariyanta'),
    },
  },
  build: {
    manifest: false,
    outDir: 'src/theme/sariyanta/styles',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/styles/theme.css',
      output: {
        assetFileNames: 'theme.hubl.css',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', 'dist/**'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/*.d.ts',
        '**/*.config.*',
        'src/test/**',
        '**/fields.type.ts',
      ],
    },
  },
});
