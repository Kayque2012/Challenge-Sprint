import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Configuração separada para testes (sem Tailwind — não necessário em jsdom)
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/pages/**', 'src/utils/**'],
      exclude: ['src/test/**', 'node_modules/**'],
    },
  },
});
